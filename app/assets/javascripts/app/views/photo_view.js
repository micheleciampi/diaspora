app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {
console.log("coseeeeeeeee", this.model)
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
