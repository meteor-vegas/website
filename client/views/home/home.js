Template.home.rendered = function() {
  document.title = 'Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  $('[data-toggle=tooltip]').tooltip();
};
