Meteor.startup(function() {
  Meteor.call("fetchProfiles");
  Meteor.call("fetchEvents", "upcoming,past");

  if (Meteor.users.find({}).count() === 0) {
    Meteor.call("fetchProfiles");
  }

  if (Meetups.find({}).count() === 0) {
    Meteor.call("fetchEvents", "upcoming,past");
  }

});
