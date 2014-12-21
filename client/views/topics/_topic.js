Template._topic.helpers({
  alreadyVoted: function() {
    return Meteor.user() && _(Meteor.user().profile.votedTopicIds).contains(this._id);
  },

  isPresented: function() {
    return !!this.presented;
  },

  hasComments: function() {
    return this.numberOfComments > 0;
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
      Meteor.call('voteOnTopic', this._id);
    }
  },

  'click [data-unvote]': function(event, template) {
    event.preventDefault();

    var alreadyVoted = _(Meteor.user().profile.votedTopicIds).contains(this._id);
    if (alreadyVoted) {
      Meteor.call('unVoteOnTopic', this._id);
    }
  },

  'click [data-remove]': function(event, template) {
    event.preventDefault();

    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      if (confirm('Are you sure you want to remove this topic?')) {
        Topics.remove(this._id);
        Router.go('/topics');
      }
    }
  }
});