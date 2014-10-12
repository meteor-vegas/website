Template.registerHelper('summarize', function(string) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(140);
});

Template.registerHelper('urlEncode', function(string) {
  return _.words(string).join('+');
});

// Template.registerHelper('breaklines', function(string) {
//     string = string.replace(/(\r\n|\n|\r)/gm, '<br>');
//     return new Spacebars.SafeString(string);
// });
