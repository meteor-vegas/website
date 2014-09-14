Template.presentations.rendered = function() {
};

Template.presentations.presentations = function() {
  return Presentations.find({});
}
