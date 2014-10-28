Meteor.startup(function() {
  Meteor.call("fetchProfiles");
  Meteor.call("fetchEvents", "upcoming,past");
});
