app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {
	console.log("----",keyToCrypt)
	jQuery.ajaxSetup({async:false});
	this.model.get("sizes").small=decrypt(this.model.get("sizes").small, keyToCrypt)
	this.model.get("sizes").medium=decrypt(this.model.get("sizes").medium, keyToCrypt)
	this.model.get("sizes").large=decrypt(this.model.get("sizes").largei, keyToCrypt)
	jQuery.ajaxSetup({async:true});
	$(this.el).attr("id", this.model.get("guid"));
	this.model.bind('remove', this.remove, this);
	return this;
  }
  
});
