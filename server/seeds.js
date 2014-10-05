Meteor.startup(function() {

  if (Meteor.users.find({}).count() === 0) {
    Meteor.call("fetchMembers");
  }

  if (Meetups.find({}).count() === 0) {
    Meteor.call("fetchEvents", "upcoming,past");
  }

});
