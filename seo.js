Meteor.startup(function() {
  if(Meteor.isClient) {
    SEO.config({
      title: 'Meteor Vegas',
      meta: {
        'description': 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV'
      }
    });
  }
});
