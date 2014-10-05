Presentations = new Mongo.Collection('presentations');

Presentations.after.insert(function(userId, doc) {
  Activities.insert({
    userId: userId,
    subjectId: doc._id,
    subjectTitle: doc.title,
    subjectType: 'topic',
    type: 'created_presentation'
  });
});

Presentations.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
