/// Select the correct environement (prod/dev) and retreive the associated
/// settings. We also edit the meetup service configuration in case the
/// credentials have changed.
///
/// XXX We should use meteor native development and --production envs

Meteor.startup(function() {
  var environment = process.env.NODE_ENV || "development";
  var settings = Meteor.settings[environment];

  // We remove configuration entry in case service is already configured.
  // This is needed when there is a change in key/secret.
  ServiceConfiguration.configurations.remove({
    service: "meetup"
  });

  if (environment === 'development')
    console.log("## Running Development Environment ##");
  else if(environment === 'production')
    console.log("## Running Production Environment ##");
  else
    console.error("Unknowed environment ", environment);

  if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
    ServiceConfiguration.configurations.insert({
      service: 'meetup',
      clientId: settings.meetup.oauth_key,
      secret: settings.meetup.oauth_secret
    });
  }
});
