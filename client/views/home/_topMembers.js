Meteor.subscribe("members");

Template._topMembers.rendered = function() {
  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template._topMembers.helpers({
  topMembers: function () {
    return Meteor.users.find({}, {fields: {profile: 1}, sort: {'profile.points': -1}, limit: 6} );
  }
});
