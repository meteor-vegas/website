// A centralized definition for allow and deny rules. These rules are enforced
// for minimongo queries initiated on the client and their consequences,
// particularly the "hooks" defined using the `matb33:collection-hooks` package.
// This file is organized in two parts, first we set the rules for normal users,
// and then for administrators.
//
// XXX We should be more consistent about how we name the `author` field
// (generally the user that can update a document), it is sometimes named
// `userId` (which is a bit vague) and sometimes something else ("presenter").


// We use deny here because by default Meteor will authorize `profile` in any
// case, and we have fields like `points` in the profile that we don't want the
// user to update.
//
// XXX Relax these rules by moving sensible data out of `profile`
Meteor.users.deny({
  insert: function() { return true; },
  update: function() { return true; },
  remove: function() { return true; },
  fetch: []
});

Topics.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  update: function(userId, doc, fields, modifier) {
    return userId && doc.userId === userId;
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
  fetch: ['presenter']
});

Comments.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  update: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  fetch: ['userId']
});

// We use the `alanning:roles` package to determine if a user is an
// administrator.
var isAdmin = function(userId) {
  return userId && Roles.userIsInRole(userId, ['admin']);
};

// Administrators can update and remove any document. They don't need the
// `insert` privileged because every user is already free to insert a document.
// Furthermore giving the `insert` right here would mean that administrators
// could insert document faking the author userId, which is not something we
// want -- even for administrators.
var adminAuthorisations = {
  update: isAdmin,
  remove: isAdmin,
  fetch: []
};

Topics.allow(adminAuthorisations);
Presentations.allow(adminAuthorisations);
Activities.allow(adminAuthorisations);
Comments.allow(adminAuthorisations);
