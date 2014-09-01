Template.layout.events({
  'click [data-login-with=meetup]': function() {
    Meteor.loginWithMeetup();
  },

  'click [data-action=logout]': function() {
    Meteor.logout();
  }
});
