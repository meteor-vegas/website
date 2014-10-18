Template.footer.helpers({
  githubUrl: function() {
    return Meteor.settings.public.links.github;
  },

  twitterUrl: function() {
    return Meteor.settings.public.links.twitter;
  },

  meetupUrl: function() {
    return Meteor.settings.public.links.meetup;
  }
});
