Meteor.startup(function() {
  if(Meetups.find().count() === 0) {
    Meteor.call("fetchProfiles");
    Meteor.call("fetchEvents", "upcoming,past");
  }
});
