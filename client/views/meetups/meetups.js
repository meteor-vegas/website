Template.meetups.rendered = function() {
  document.title = 'Meetups | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template.meetups.helpers({
  displayOverflowAttendees: function() {
    if (this.numberOfOverflowAttendees) {
      return this.numberOfOverflowAttendees() > 0;
    }
  }
});
