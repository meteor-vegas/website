Meteor.publish("topics", function() {
  return Topics.find({});
});

Meteor.publish("topic", function(_id) {
  return Topics.find({_id: _id});
});
