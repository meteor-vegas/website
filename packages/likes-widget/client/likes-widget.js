Template.likesWidget.helpers({
  likedBy : function() {
    return Meteor.users.find({'profile.likedItemIds':this._id});
  },
  likedByMe: function() {
    return Meteor.user() && _(Meteor.user().profile.likedItemIds).contains(this._id);
  }
});

Template.likesWidget.events( {

  'click [data-like]': function(event, template) {
    event.preventDefault();
    if (Meteor.user()) {
      Meteor.call('likePresentation', this);
    } else {
      alert("Log in with Meetup to vote!");
      return false;
    }
  },

  'click [data-unlike]': function(event, template) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.users.update({_id: Meteor.userId()}, { $pull: {'profile.likedItemIds' : this._id} } );
    } else {
      alert("Log in with Meetup to vote!");
      return false;
    }
  }

});
