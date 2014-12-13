Template.home.helpers({
  count_members: function() {
    return Meteor.users.find().count();
  }
});

Template.home.rendered = function() {
};
