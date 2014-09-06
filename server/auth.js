Meteor.startup(function() {
  if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
    ServiceConfiguration.configurations.insert({
      service: 'meetup',
      clientId: 'et5ejo0k65uf8c3emhheuqn000',
      secret: '5d274srn0rjb5pfq8q6njstgdb'
    });
  }
});
