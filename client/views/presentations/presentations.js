Template.presentations.rendered = function() {
  document.title = 'Presentations | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};

Template.presentations.presentations = function() {
  return Presentations.find({});
}
