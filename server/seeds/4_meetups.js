Meteor.startup(function() {

  if (Meetups.find({}).count() === 0) {

    Meteor.call("fetchEvents", "upcoming,past");

  }

});
