Meteor.users.allow({
  'update': function(userId, doc, fields, modifier) {
    return userId && userId === doc._id;
  }
});

Topics.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  }
});
