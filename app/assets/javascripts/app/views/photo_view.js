function decrypt(url)
{ 
	var immagine;
        $.get(url, function(data)
        {
                stringa = GibberishAES.dec(data, "ciao");
                immagine="data:image/jpg;base64,"+stringa
        });
        return immagine
}
app.views.Photo = app.views.Base.extend({

  templateName: "photo",

  className : "photo loaded",

  initialize : function() {
	jQuery.ajaxSetup({async:false});
	this.model.get("sizes").small=decrypt(this.model.get("sizes").small)
	this.model.get("sizes").medium=decrypt(this.model.get("sizes").medium)
	this.model.get("sizes").large=decrypt(this.model.get("sizes").large)
	jQuery.ajaxSetup({async:true});
	$(this.el).attr("id", this.model.get("guid"));
	this.model.bind('remove', this.remove, this);
	return this;
  }
  
});
