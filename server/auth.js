Meteor.startup(function() {
  console.log('process.env.METEOR_ENV', process.env.METEOR_ENV);
  var environment = process.env.METEOR_ENV || "development";
  console.log('environment', environment);

  if (environment === 'development') {
    if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
      ServiceConfiguration.configurations.insert({
        service: 'meetup',
        clientId: 'et5ejo0k65uf8c3emhheuqn000',
        secret: '5d274srn0rjb5pfq8q6njstgdb'
      });
    }
  } else if(environment === 'production') {
    if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
      ServiceConfiguration.configurations.insert({
        service: 'meetup',
        clientId: 'frbivf1rgkts08cefm9mmo71ri',
        secret: '504dsotpb38vih6qrs1hvi2puu'
      });
    }
  }

});
