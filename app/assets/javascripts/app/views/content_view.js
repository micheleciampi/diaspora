app.views.Content = app.views.Base.extend({
  events: {
    "click .expander": "expandPost"
  },

  presenter : function(){
jQuery.ajaxSetup({async:false});
//console.log("large", this.model.get("author").avatar.large)
//console.log("large", this.model.get("author").avatar)
//console.log("autore del post", this.model.get("author").diaspora_id)
console.log("autore del post", this.model.get("author").diaspora_id)

personIdAuthor=this.model.get("author").id
console.log("PersonId dell'autore del post", personIdAuthor)

myFriends=app.currentUser.attributes.friends
console.log("I miei amici", myFriends)

console.log("Array amici-->user_id utente", myFriends[0].contact.user_id)
userIdPost=myFriends[0].contact.user_id


console.log("Array amici-->person_id amico", myFriends[0].contact.person_id)
personIdPost=myFriends[0].contact.person_id

avt = app.currentUser.attributes.id
console.log("Id dell'utente", avt)

console.log("keyToCrypt",keyToCrypt)

var decKey
console.log("Idutente", avt);
console.log("IdAutore", userIdPost);
if(avt==personIdAuthor) //se l'autore del post sono io
{
	decKey=keyToCrypt //decifra i dati con la chiave che uso per cifrare
}
else
{
	for(var i=0; i<myFriends.length; i++)
	{
		if(myFriends[i].contact.person_id==personIdAuthor)
		{
			try
			{
				decKey=GibberishAES.dec(myFriends[i].contact.crypted_person_password, keyToCrypt)
			}
			catch(Exc)
			{
				console.log("Master key dell'utente errata")
			}
		}	
	}
}
    var photos = this.model.get("photos")
    for(var i=0;i<photos.length;i++)
    {
        if(photos[i].sizes.small.substring(0,4)=="http")
        {
                photos[i].sizes.small=decrypt(photos[i].sizes.small, decKey)
        }
        if(photos[i].sizes.medium.substring(0,4)=="http")
        {
                photos[i].sizes.medium=decrypt(photos[i].sizes.medium, decKey)
        }
        if(photos[i].sizes.large.substring(0,4)=="http")
        {
                photos[i].sizes.large=decrypt(photos[i].sizes.large, decKey)
        }
    }
    jQuery.ajaxSetup({async:true});
    return _.extend(this.defaultPresenter(), {
      text : app.helpers.textFormatter(this.model.get("text"), this.model),
      largePhoto : this.largePhoto(),
      smallPhotos : this.smallPhotos(),
      location: this.location()
    });
  },


  largePhoto : function() {
//alert(this.model.get("text"))
//console.log("large", this.model.get("author").avatar.large)
//console.log("large", this.model.get("author").avatar)


  var photos = this.model.get("photos")
  if(!photos || photos.length == 0) { return }

    return photos[0]
  },

  smallPhotos : function() {
console.log(this.model)
	//console.log("autore del post", this.model.get("author").diaspora_id)
    var photos = this.model.get("photos")
    if(!photos || photos.length < 2) { return }
    return photos.slice(1,8)
  },


  expandPost: function(evt) {
    var el = $(this.el).find('.collapsible');
    el.removeClass('collapsed').addClass('opened');
    el.animate({'height':el.data('orig-height')}, 550, function() {
      el.css('height','auto');
    });
    $(evt.currentTarget).hide();
  },

  location: function(){
    var address = this.model.get('address')? this.model.get('address') : '';
    return address;
  },

  collapseOversized : function() {
    var collHeight = 200
      , elem = this.$(".collapsible")
      , oembed = elem.find(".oembed")
      , opengraph = elem.find(".opengraph")
      , addHeight = 0;
    if($.trim(oembed.html()) != "") {
      addHeight += oembed.height();
    }
    if($.trim(opengraph.html()) != "") {
      addHeight += opengraph.height();
    }

    // only collapse if height exceeds collHeight+20%
    if( elem.height() > ((collHeight*1.2)+addHeight) && !elem.is(".opened") ) {
      elem.data("orig-height", elem.height() );
      elem
        .height( Math.max(collHeight, addHeight) )
        .addClass("collapsed")
        .append(
        $('<div />')
          .addClass('expander')
          .text( Diaspora.I18n.t("show_more") )
      );
    }
  },

  postRenderTemplate : function(){
    _.defer(_.bind(this.collapseOversized, this))
  }
});

app.views.StatusMessage = app.views.Content.extend({
  templateName : "status-message"
});

app.views.ExpandedStatusMessage = app.views.StatusMessage.extend({
  postRenderTemplate : function(){
  }
});

app.views.Reshare = app.views.Content.extend({
  templateName : "reshare"
});

app.views.OEmbed = app.views.Base.extend({
  templateName : "oembed",
  events : {
    "click .thumb": "showOembedContent"
  },

  presenter:function () {
    o_embed_cache = this.model.get("o_embed_cache")
    if(o_embed_cache) {
      typemodel = { rich: false, photo: false, video: false, link: false }
      typemodel[o_embed_cache.data.type] = true
      o_embed_cache.data.types = typemodel
    }
    return _.extend(this.defaultPresenter(), {
      o_embed_html : app.helpers.oEmbed.html(o_embed_cache)
    })
  },

  showOembedContent : function (evt) {
    if( $(evt.target).is('a') ) return;
    var insertHTML = $(app.helpers.oEmbed.html(this.model.get("o_embed_cache")));
    var paramSeparator = ( /\?/.test(insertHTML.attr("src")) ) ? "&" : "?";
    insertHTML.attr("src", insertHTML.attr("src") + paramSeparator + "autoplay=1&wmode=opaque");
    this.$el.html(insertHTML);
  }
});

app.views.OpenGraph = app.views.Base.extend({
  templateName : "opengraph"
});
