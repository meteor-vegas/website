Meteor.publish("meetups", function() {
  Meteor.publishWithRelations({
    handle: this,
    collection: Meetups,
    filter: {}
  });
});

Meteor.publish("meetup", function(_id) {
  Meteor.publishWithRelations({
    handle: this,
    collection: Meetups,
    filter: _id,
    mappings: [
      {
        key: "attendeeIds",
        collection: Meteor.users
      }
    ]
  });
});

Meteor.publish("topics", function() {
  Meteor.publishWithRelations({
    handle: this,
    collection: Topics,
    filter: {},
    mappings: [
      {
        key: 'userId',
        collection: Meteor.users
      }
    ]
  });
});

Meteor.publish("topic", function(_id) {
  Meteor.publishWithRelations({
    handle: this,
    collection: Topics,
    filter: _id,
    mappings: [
      {
        key: 'userId',
        collection: Meteor.users
      },
      {
        reverse: true,
        key: 'parentId',
        collection: Comments,
        filter: { parentType: 'topic' },
        mappings: [
          {
            key: 'userId',
            collection: Meteor.users
          }
        ]
      }
    ]
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

//Presentations
Meteor.publish("presentations", function() {
  return Presentations.find({});
});

Meteor.publish("presentation", function(_id) {
  Meteor.publishWithRelations({
    handle: this,
    collection: Presentations,
    filter: _id,
    mappings: [
      {
        key: 'userId', //Author
        collection: Meteor.users
      },
      {
        reverse: true,
        key: 'parentId',
        collection: Comments,
        filter: { parentType: 'presentation' },
        mappings: [
          {
            key: 'userId', //Author of each comment
            collection: Meteor.users
          }
        ]
      },
      {
        key: 'profile.likedIds',
        collection: Meteor.users,
      }
    ]
  });
});


Presentations.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  }
});
