Template.registerHelper('summarize', function(string) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(140);
});

Template.registerHelper('urlEncode', function(string) {
  return _.words(string).join('+');
});
