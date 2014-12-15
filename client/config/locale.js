Meteor.startup(function(){
  if(Meteor.settings.public.default_lang) {
    TAPi18n.setLanguage(Meteor.settings.public.default_lang);
    moment.locale(Meteor.settings.public.default_lang);
  }
});
