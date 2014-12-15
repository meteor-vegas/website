var isAdmin = function(userId) {
  return userId && Roles.userIsInRole(userId, ['admin']);
};

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
    return (userId && doc.userId === userId) || isAdmin(userId);
  },
  remove: isAdmin,
  fetch: ['userId']
});

Presentations.allow({
  insert: function(userId, doc) {
    return userId && doc.presenter && doc.presenter._id === userId;
  },
  update: function(userId, doc, fields, modifier) {
    return (userId && doc.presenter && doc.presenter._id === userId) || isAdmin(userId);
  },
  remove: isAdmin,
  fetch: ['presenter']
});

Comments.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  update: function(userId, doc) {
    return (userId && doc.userId === userId) || isAdmin(userId);
  },
  remove: isAdmin,
  fetch: ['userId']
});

Activities.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: isAdmin,
  remove: isAdmin
});
