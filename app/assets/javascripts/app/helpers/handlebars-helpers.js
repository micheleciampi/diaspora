
Handlebars.registerHelper('t', function(scope, values) {
  return Diaspora.I18n.t(scope, values.hash)
});

Handlebars.registerHelper('imageUrl', function(path){
  return app.baseImageUrl() + path;
});

Handlebars.registerHelper('linkToPerson', function(context, block) {
  var html = "<a href=\"/people/" + context.guid + "\" class=\"author-name ";
      html += Handlebars.helpers.hovercardable(context);
      html += "\">";
      html += block.fn(context);
      html += "</a>";

  return html
});


// allow hovercards for users that are not the current user.
// returns the html class name used to trigger hovercards.
Handlebars.registerHelper('hovercardable', function(person) {
  if( app.currentUser.get('guid') != person.guid ) {
    return 'hovercardable';
  }
  return '';
});

Handlebars.registerHelper('personImage', function(person, size, imageClass) {
  /* we return here if person.avatar is blank, because this happens when a
   * user is unauthenticated.  we don't know why this happens... */
console.log("avt--->", person)
console.log("model", this.model)
  if( _.isUndefined(person.avatar) ) { return }

  size = ( !_.isString(size) ) ? "small" : size;
  imageClass = ( !_.isString(imageClass) ) ? size : imageClass;
jQuery.ajaxSetup({async:false});
	if(!(typeof person.avatar[size]==="undefined") && person.avatar[size].substring(0, 4)=="http")
	{
		person.avatar[size]=decrypt(person.avatar[size], keyToCrypt)
	}
 jQuery.ajaxSetup({async:true});
  return _.template('<img src="<%= src %>" class="avatar <%= img_class %>" title="<%= title %>" />', {
    'src': person.avatar[size],
    'img_class': imageClass,
    'title': _.escape(person.name)
  });
});

Handlebars.registerHelper('localTime', function(timestamp) {
  return new Date(timestamp).toLocaleString();
});
