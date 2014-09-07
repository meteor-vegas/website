Meteor.publish("topics", function() {
  return Topics.find({});
});

Meteor.publish("topic", function(_id) {
  return Topics.find({_id: _id});
});

//need to setup security for these before going into production
Meteor.publish("members", function () {
	//return Meteor.users.find({})
  return Meteor.users.find({}, {fields: {'profile': 1}});
});

Meteor.publish("member", function(_id) {
  return Meteor.users.find({_id: _id});
});


Meteor.users.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true;
    }
});

//Presentations
Meteor.publish("presentations", function() {
  return Presentations.find({});
});

Meteor.publish("presentation", function(_id) {
  return Presentations.find({_id: _id});
});

Presentations.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  }
});
