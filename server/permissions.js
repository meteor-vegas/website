Meteor.users.deny({
  insert: function (userId,doc) {
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

Topics.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  update: function(userId, doc, fields, modifier) {
    return userId && doc.userId === userId;
  },
  remove: function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  },
  fetch: ['userId']
});

Presentations.allow({
  insert: function(userId, doc) {
    return userId && doc.presenter && doc.presenter._id === userId;
  },
  update: function(userId, doc, fields, modifier) {
    return userId && doc.presenter && doc.presenter._id === userId;
  },
  remove: function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  },
  fetch: ['presenter']
});

Comments.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  }
});

Activities.allow({
  insert: function(userId, doc) {
    return false;
  },
  remove: function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  }
});

Coupons.allow({
  insert: function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  },
  remove: function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  }
});
