Meteor.publish("topics", function() {
  return Topics.find({});
});

Meteor.publish("topic", function(_id) {
  return Topics.find({_id: _id});
});

Topics.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  }
});
