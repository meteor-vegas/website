Meteor.subscribe("members");

Template.members.rendered = function() {
  document.title = 'Members | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};
