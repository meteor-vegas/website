Template.members.helpers({
  count_members: function() {
    return Meteor.users.find().count();
  }
});

Template.members.rendered = function() {
};
