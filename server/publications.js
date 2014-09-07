Meteor.publish("topics", function() {
  Meteor.publishWithRelations({
    handle: this,
    collection: Topics,
    filter: {},
    mappings: [{
      key: 'userId',
      collection: Meteor.users
    }]
  });
});

Meteor.publish("topic", function(_id) {
  Meteor.publishWithRelations({
    handle: this,
    collection: Topics,
    filter: _id,
    mappings: [{
      key: 'userId',
      collection: Meteor.users
    }]
  });
});

//need to setup security for these before going into production
Meteor.publish("members", function () {
	//return Meteor.users.find({})
  return Meteor.users.find({}, {fields: {'profile': 1}});
});

Meteor.publish("member", function(_id) {
  return Meteor.users.find({_id: _id});
});
