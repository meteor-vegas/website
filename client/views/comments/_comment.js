Template._comment.helpers({
  author: function() {
    return Meteor.users.findOne({_id: this.userId});
  }
});
