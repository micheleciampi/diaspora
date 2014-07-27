app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {

console.log("Model picture", this.model)
personIdAuthor=this.model.get("author").id
console.log("PersonId dell'autore del post", personIdAuthor)

myFriends=app.currentUser.attributes.friends
console.log("I miei amici", myFriends)

avt = app.currentUser.attributes.id
console.log("Id dell'utente", avt)

console.log("keyToCrypt",keyToCrypt)
console.log("Impor nelle foto", this.model.get("key_to_read"))
var decKey = keyToCrypt
console.log("Idutente", avt);
if(avt != personIdAuthor)
{
	decKey=this.model.get("key_to_read")
        Bits = 512
        decKey = cryptico.decrypt(decKey, RSAkey).plaintext;
}
	console.log("----",keyToCrypt)
	jQuery.ajaxSetup({async:false});
	this.model.get("sizes").small=decrypt(this.model.get("sizes").small, decKey)
	this.model.get("sizes").medium=decrypt(this.model.get("sizes").medium, decKey)
	this.model.get("sizes").large=decrypt(this.model.get("sizes").largei, decKey)
	jQuery.ajaxSetup({async:true});
	$(this.el).attr("id", this.model.get("guid"));
	this.model.bind('remove', this.remove, this);
	return this;
  }
  
});
