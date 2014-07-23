var keyToCrypt
var master_key
var RSAkey
app.views.Base = Backbone.View.extend({

  initialize : function(options) {
    this.setupRenderEvents();
  },

  presenter : function(){
    return this.defaultPresenter()
  },

  setupRenderEvents : function(){
    // this line is too generic.  we usually only want to re-render on
    // feedback changes as the post content, author, and time do not change.
    //
    // this.model.bind('change', this.render, this);
  },

  defaultPresenter : function(){
    var modelJson = this.model && this.model.attributes ? _.clone(this.model.attributes) : {}
	cryptedKey=app.currentUser.attributes.master_key
	personIdUtente=app.currentUser.attributes.id

	console.log("---->Person id dell'utente", personIdUtente)
	console.log("---->Chiave cifrata", cryptedKey)
	master_key=localStorage.getItem('master_key')
	keyToCrypt = CryptoJS.AES.decrypt(cryptedKey, master_key).toString(CryptoJS.enc.Base64);
	console.log("---->Master key", master_key)
	console.log("---->Chiave per cifrare i dati", keyToCrypt)

	cryptedPrivateKey = app.currentUser.attributes.private_key
	console.log("---->Crypted private key", cryptedPrivateKey)
	privateKey = CryptoJS.AES.decrypt(cryptedPrivateKey, master_key).toString(CryptoJS.enc.Utf8);
	console.log("---->private key", privateKey)
	if(!RSAkey)
	{
		bits = 512
		RSAkey = cryptico.generateRSAKey(privateKey, bits);
		publicKeyString = cryptico.publicKeyString(RSAkey);
		console.log("---->public key", publicKeyString);
	}

jQuery.ajaxSetup({async:false});
    avt = app.currentUser.attributes.avatar.large
    if(avt.substring(0, 4)=="http")
	{
		app.currentUser.attributes.avatar.large = decrypt(avt, keyToCrypt)
	}
    avt = app.currentUser.attributes.avatar.medium
    if(avt.substring(0, 4)=="http")
	{
		app.currentUser.attributes.avatar.medium = decrypt(avt, keyToCrypt) 
	}
    avt = app.currentUser.attributes.avatar.small
    if(avt.substring(0, 4)=="http")
	{
		app.currentUser.attributes.avatar.small = decrypt(avt, keyToCrypt)
	}
jQuery.ajaxSetup({async:true});
    return _.extend(modelJson, {
      current_user : app.currentUser.attributes,
      loggedIn : app.currentUser.authenticated()
    });
  },

  render : function() {
    this.renderTemplate()
    this.renderSubviews()
    this.renderPluginWidgets()
    this.removeTooltips()

    return this
  },

  renderTemplate : function(){
    var presenter = _.isFunction(this.presenter) ? this.presenter() : this.presenter
    this.template = JST[this.templateName+"_tpl"]
    if(!this.template) {
      console.log(this.templateName ? ("no template for " + this.templateName) : "no templateName specified")
    }

    this.$el
      .html(this.template(presenter))
      .attr("data-template", _.last(this.templateName.split("/")));
    this.postRenderTemplate();
  },

  postRenderTemplate : $.noop, //hella callbax yo

  renderSubviews : function(){
    var self = this;
    _.each(this.subviews, function(property, selector){
      var view = _.isFunction(self[property]) ? self[property]() : self[property]
      if(view) {
        self.$(selector).html(view.render().el)
        view.delegateEvents();
      }
    })
  },

  renderPluginWidgets : function() {
    this.$(this.tooltipSelector).tooltip();
    this.$("time").timeago();
  },

  removeTooltips : function() {
    $(".tooltip").remove();
  },

  setFormAttrs : function(){
    this.model.set(_.inject(this.formAttrs, _.bind(setValueFromField, this), {}))

    function setValueFromField(memo, attribute, selector){
      if(attribute.slice("-2") === "[]") {
        memo[attribute.slice(0, attribute.length - 2)] = _.pluck(this.$el.find(selector).serializeArray(), "value")
      } else {
        memo[attribute] = this.$el.find(selector).val() || this.$el.find(selector).text();
      }
      return memo
    }
  },

  destroyModel: function(evt) {
    evt && evt.preventDefault();
    var self = this;
    var url = this.model.urlRoot + '/' + this.model.id;

    if (confirm(Diaspora.I18n.t("confirm_dialog"))) {
      this.model.destroy({ url: url })
        .done(function() {
          self.remove();
        })
        .fail(function() {
          var flash = new Diaspora.Widgets.FlashMessages;
          flash.render({
            success: false,
            notice: Diaspora.I18n.t('failed_to_remove')
          });
        });
    }
  }
});

