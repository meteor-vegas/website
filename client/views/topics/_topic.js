Template._topic.helpers({
  alreadyVoted: function() {
    return Meteor.user() && _(Meteor.user().profile.votedTopicIds).contains(this._id)
  },

  author: function() {
    return Meteor.users.findOne({_id: this.userId});
  }
});

Template._topic.events({
  'click [data-vote]': function(event, template) {
    event.preventDefault();

    if (!Meteor.user()) {
      alert("Log in with Meetup to vote!");
      return false;
    }

    var alreadyVoted = _(Meteor.user().profile.votedTopicIds).contains(this._id);
    if (!alreadyVoted) {
      var points = this.points + 1;
      console.log('Topics.update({_id: ' + this._id + '}, {$set: {points: ' + points + '}})');
      Topics.update({_id: this._id}, {$set: {points: points}});
      Meteor.users.update({_id: Meteor.userId()}, {$push: {'profile.votedTopicIds': this._id}});
    }
  }
});
