app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {

	if(!this.model.attributes.public)
	{
		personIdAuthor=this.model.get("author").id
		personIdCurrentUser = app.currentUser.attributes.id
		var keyToDecrypt
		if(personIdCurrentUser==personIdAuthor) //am i the autor?
		{
						keyToDecrypt = keyToCrypt
		}
		else
		{
			try
			{
			keyToDecrypt=this.model.get("key_to_read")
			keyToDecrypt = cryptico.decrypt(keyToDecrypt, RSAkey).plaintext;
			}
			catch(Exc)
			{
				console.log("Uncorrect RSA keys")
			}
		}
		this.model.get("sizes").small=decrypt(this.model.get("sizes").small, keyToDecrypt)
		this.model.get("sizes").medium=decrypt(this.model.get("sizes").medium, keyToDecrypt)
		this.model.get("sizes").large=decrypt(this.model.get("sizes").largei, keyToDecrypt)
	}

	$(this.el).attr("id", this.model.get("guid"));
	this.model.bind('remove', this.remove, this);
	return this;
  }
  
});
