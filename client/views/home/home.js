// XXX This helper rely on the fact that we publish and subscribe to all users
// in any case, including here on the home page (even if we don't need to).
// This behavior should probably be improved using a dedicated pub/sub for the
// users counter.
Template.home.helpers({
  count_members: function() {
    return Meteor.users.find().count();
  }
});
