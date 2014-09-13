Template.meetupDetail.rendered = function() {
  document.title = 'Meetup Name Goes Here | Meetups | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  $('[data-toggle=tooltip]').tooltip();
};

Template.meetupDetail.helpers({
  displayOverflowAttendees: function() {
    if (this.meetup) {
      return this.meetup.numberOfOverflowAttendees() > 0;
    }
  }
});
