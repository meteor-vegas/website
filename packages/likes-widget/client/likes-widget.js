Template.likesWidget.helpers({
  likedBy : function() {
    return Meteor.users.find({'profile.likedItemIds':this._id});
  },
  likedByMe: function() {
    console.log("this", this);
    return Meteor.user() && _(Meteor.user().profile.likedItemIds).contains(this._id);
  }
});

Template.likesWidget.events( {

  'click [data-like]': function(event, template) {

    event.preventDefault();
    var me = Meteor.user();
    if ( me ) {
      Meteor.users.update({_id: me._id}, { $addToSet: {'profile.likedItemIds' : this._id} } );
    } else {
      alert("Log in with Meetup to vote!");
      return false;
    }
  },
  'click [data-unlike]': function(event, template) {

    event.preventDefault();
    var me = Meteor.user();
    if ( me ) {
      Meteor.users.update({_id: me._id}, { $pull: {'profile.likedItemIds' : this._id} } );
    } else {
      alert("Log in with Meetup to vote!");
      return false;
    }
  }
} )
