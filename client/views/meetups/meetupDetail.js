Template.meetupDetail.rendered = function() {
  document.title = 'Meetup Name Goes Here | Meetups | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template.meetupDetail.helpers({
  displayOverflowAttendees: function() {
    if (this.meetup) {
      return this.meetup.numberOfOverflowAttendees() > 0;
    }
  },

  currentUserIsAttendee: function() {
    if (this.meetup && Meteor.userId()) {
      return _(this.meetup.attendeeIds).include(Meteor.userId());
    }
  },

  attendeesHeading: function() {
    if (this.meetup.isPast()) {
      return 'Who Went';
    } else {
      return "Who's Going";
    }
  }
});

Template.meetupDetail.events({
  'click [data-action=rsvp]': function(event, template) {
    event.preventDefault();

    if (!Meteor.userId()) {
      alert("Please sign in to RSVP!");
      return false;
    }

    Meteor.call('rsvp', {'meetupId': this.meetup._id}, function(error) {
      if (error) {
        alert(error);
      }
    });
  }
});
