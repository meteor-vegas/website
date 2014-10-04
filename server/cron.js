var meetupCron = new Cron(function() {
  Meteor.call("fetchEvents", "upcoming");
}, {
  minute: 30
});
