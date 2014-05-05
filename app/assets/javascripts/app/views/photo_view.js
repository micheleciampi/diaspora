app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {
personIdAuthor=this.model.get("author").id
console.log("PersonId dell'autore del post", personIdAuthor)

myFriends=app.currentUser.attributes.friends
console.log("I miei amici", myFriends)

avt = app.currentUser.attributes.id
console.log("Id dell'utente", avt)

console.log("keyToCrypt",keyToCrypt)

var decKey
console.log("Idutente", avt);
decKey=searchPassword(avt, personIdAuthor, myFriends)
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
