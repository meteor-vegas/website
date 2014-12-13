Meteor.users.allow({
  'insert': function(userId, doc) {
    return true;
  },

  'update': function(userId, doc, fields, modifier) {
    return userId && userId === doc._id;
  }
});

Meteor.users.deny({
  update: function(userId, doc, fields, modifier) {
    if (!userId) return true;
    if (Roles.userIsInRole(userId, ['admin']))
      return false;
    return _.contains(_.keys(modifier.$set), 'profile.points');
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
    return false;
  }
});