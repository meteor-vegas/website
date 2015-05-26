Meteor.startup(function() {
  var environment = process.env.NODE_ENV || Meteor.settings.environment || "development";

  // first, remove configuration entry in case service is already configured. This is needed when there is a change in key/secret
  ServiceConfiguration.configurations.remove({
      service: "meetup"
  });

  if (_.contains(environment, Meteor.settings)) {
    throw Meteor.Error(500, "Bad settings");
  }

  var settings = Meteor.settings[environment];

  console.log("## Running " + environment + " Environment ##");
    
  if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
    ServiceConfiguration.configurations.insert({
      service: 'meetup',
      clientId: settings.meetup.oauth_key,
      secret: settings.meetup.oauth_secret
    });
  }

});
