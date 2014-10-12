var fetchEvents = new Cron(function() {
  Meteor.call("fetchEvents", "upcoming");
}, {
  minute: 30
});

var fetchProfiles = new Cron(function() {
  Meteor.call("fetchProfiles") ;
} , {
  minute: 30
});
