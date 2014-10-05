Comments = new Mongo.Collection('comments');

Comments.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
