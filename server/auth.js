Meteor.startup(function() {
  var environment = process.env.NODE_ENV || "development";
  //var environment = Meteor.settings.environment || "development" ;
  
     // first, remove configuration entry in case service is already configured. This is needed when there is a change in key/secret
    ServiceConfiguration.configurations.remove({
        service: "meetup"
    });

  if (environment === 'development') {
    console.log("## Running Development Environment ##");
    
    var settings = Meteor.settings.development;

    if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
      ServiceConfiguration.configurations.insert({
        service: 'meetup',
        clientId: settings.meetup.oauth_key,
        secret: settings.meetup.oauth_secret
      });
    }
  } else if(environment === 'production') {
    console.log("## Running Production Environment ##");
    
    var settings = Meteor.settings.production;
    
    if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
      ServiceConfiguration.configurations.insert({
        service: 'meetup',
        clientId: settings.meetup.oauth_key,
        secret: settings.meetup.oauth_secret
      });
    }
  }

});
