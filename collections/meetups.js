Meetups = new Meteor.Collection('meetups');

Meetups.helpers({
  attendees: function() {
    return Meteor.users.find({_id: {$in: this.attendeeIds}});
  },

  truncatedAttendees: function() {
    return Meteor.users.find({_id: {$in: this.attendeeIds}}, {limit: 5});
  },

  numberOfOverflowAttendees: function() {
    return this.attendeeIds.length - 5;
  },

  isPast: function() {
    return moment(this.dateTime).isBefore(moment());
  }
});
