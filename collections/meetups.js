Meetups = new Meteor.Collection('meetups');

Meetups.helpers({
  attendees: function() {
    return Meteor.users.find({_id: {$in: this.attendeeIds}});
  }
});
