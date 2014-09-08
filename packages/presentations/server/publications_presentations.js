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
        key: 'userId',
        collection: Meteor.users
      },
      {
        reverse: true,
        key: 'parentId',
        collection: Comments,
        filter: { parentType: 'presentation' },
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


Presentations.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
  }
});
