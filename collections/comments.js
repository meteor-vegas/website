Comments = new Mongo.Collection('comments');

Comments.after.insert(function(userId, doc) {
  var type = 'commented_on_' + doc.parentType;
  Activities.insert({
    userId: userId,
    subjectId: doc.parentId,
    subjectType: doc.parentType,
    // subjectTitle: doc.title,
    type: type
  });
});

Comments.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
