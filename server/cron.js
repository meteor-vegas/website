/// We fetch events using the `Cron` API provided by the `chfritz:easycron`
/// package.

new Cron(
  function() { Meteor.call("fetchEvents", "upcoming"); },
  { minute: 30 }
);

new Cron(
  function() { Meteor.call("fetchProfiles"); },
  { minute: 30 }
);
