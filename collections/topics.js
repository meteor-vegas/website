Topics = new Mongo.Collection('topics');

Topics.after.insert(function(userId, doc) {
  Activities.insert({
    userId: userId,
    subjectId: doc._id,
    subjectTitle: doc.title,
    subjectType: 'topic',
    type: 'created_topic'
  });
});

Comments.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
