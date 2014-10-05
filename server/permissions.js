Meteor.users.allow({
  'insert': function (userId,doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },

  'update': function(userId, doc, fields, modifier) {
    // return userId && userId === doc._id;
    return true;
  }
});

Topics.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  },
  'remove': function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  }
});

Presentations.allow({
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

Activities.allow({
  'insert': function(userId, doc) {
    return userId && userId === doc.userId;
  }
});
