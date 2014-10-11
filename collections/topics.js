Topics = new Mongo.Collection('topics');

Topics.helpers({
  presenter: function() {
    return Meteor.users.findOne(this.presenterId);
  },
  author: function() {
    return Meteor.users.findOne(this.userId);
  },
  meetup: function() {
    if (this.presented && this.meetupId) {
      return Meetups.findOne(this.meetupId);
    }
  }
});

Topics.after.insert(function(userId, doc) {
  Activities.insert({
    userId: userId,
    subjectId: doc._id,
    subjectTitle: doc.title,
    subjectType: 'topic',
    type: 'created_topic'
  });
});

Topics.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
