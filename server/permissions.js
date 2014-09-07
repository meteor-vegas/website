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

Comments.allow({
  'insert': function(userId, doc) {
    return userId;
  }
});

Meteor.users.allow({
  'insert': function (userId,doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  }
});
