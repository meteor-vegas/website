Template.layout.events({
  'click [data-login-with=meetup]': function() {
    Meteor.loginWithMeetup({
      requestPermissions: []
    }, function (error) {
      if (error) {
        alert(error);
      }
    });
  },

  'click [data-action=logout]': function() {
    Meteor.logout();
  }
});
