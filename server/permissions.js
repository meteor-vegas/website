Meteor.users.allow({
  'insert': function (userId,doc) {
    return false;
  },

  'update': function(userId, doc, fields, modifier) {
    return false;
  },
  'remove': function(userId, doc) {
    return false;
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
  },
  'remove': function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  }
});

Comments.allow({
  'insert': function(userId, doc) {
    return userId;
  }
});

Activities.allow({
  'insert': function(userId, doc) {
    return false;
  }
});

Coupons.allow({
  'insert': function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  },
  'remove': function(userId, doc) {
    return userId && Roles.userIsInRole(userId, ['admin']);
  }
});
