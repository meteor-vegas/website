Meteor.startup(function() {
  Meteor.call("fetchProfiles");

  if (Meteor.users.find({}).count() === 0) {
    Meteor.call("fetchProfiles");
  }

  if (Meetups.find({}).count() === 0) {
    Meteor.call("fetchEvents", "upcoming,past");
  }

});
