//= require ./content_view
app.views.Comment = app.views.Content.extend({
  templateName: "comment",
  className : "comment media",

  events : function() {
    return _.extend({}, app.views.Content.prototype.events, {
      "click .comment_delete": "destroyModel"
    });
  },

  initialize : function(options){
    this.templateName = options.templateName || this.templateName
    this.model.on("change", this.render, this)
  },

  presenter : function() {
	var isPublicComment = this.model.attributes.parent.public
	var textComment
	if(!isPublicComment)
	{
		
		personIdCurrentUser = app.currentUser.attributes.id
		personIdAuthor=this.model.attributes.parent.author.id
		var keyToDecrypt
		if(personIdCurrentUser==personIdAuthor) //am i the comment's autor?
		{
						keyToDecrypt = keyToCrypt
		}
		else
		{
			try
			{
			keyToDecrypt = this.model.attributes.parent.key_to_read
			keyToDecrypt = cryptico.decrypt(keyToDecrypt, RSAkey).plaintext;
			}
			catch(Exc)
			{
				console.log("Uncorrect RSA keys")
			}
		}
		textComment = decryptText(keyToDecrypt, this.model.get("text"))
	}
	else
	{
		textComment = this.model.get("text")
	}

    return _.extend(this.defaultPresenter(), {
      canRemove: this.canRemove(),
      text : app.helpers.textFormatter(textComment, this.model)
    })
  },

  ownComment : function() {
    return app.currentUser.authenticated() && this.model.get("author").diaspora_id == app.currentUser.get("diaspora_id")
  },

  postOwner : function() {
    return  app.currentUser.authenticated() && this.model.get("parent").author.diaspora_id == app.currentUser.get("diaspora_id")
  },

  canRemove : function() {
    return app.currentUser.authenticated() && (this.ownComment() || this.postOwner())
  }
});

app.views.ExpandedComment = app.views.Comment.extend({
  postRenderTemplate : function(){
  }
});
