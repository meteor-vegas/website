Meteor.publish("meetups", function() {
  return Meetups.find({});
});

Meteor.publishComposite("meetup", function(_id) {
  return {
    find: function() {
      return Meetups.find({_id: _id});
    },
    children: [
     {
       find: function(meetup) {
         if (meetup.attendeeIds) {
           return Meteor.users.find({_id: {$in: meetup.attendeeIds}});
         }
       }
     },
     {
       find: function(meetup) {
         return Topics.find({meetupId: meetup._id});
       },
       children: [
        {
          find: function(topic) {
            return Meteor.users.find({_id: topic.presenterId});
          }
        }
       ]
     }
    ]
  };
});

Meteor.publishComposite("suggestedTopics", function() {
  return {
    find: function() {
      return Topics.find({presented: {$ne: true}});
    },
    children: [
      {
        find: function(topic) {
          return Meteor.users.find({_id: topic.userId});
        }
      }
    ]
  };
});

Meteor.publishComposite("presentedTopics", function() {
  return {
    find: function() {
      return Topics.find({presented: true});
    },
    children: [
      {
        find: function(topic) {
          return Meteor.users.find({_id: topic.userId});
        }
      },
      {
        find: function(topic) {
          if (topic.presented && topic.meetupId) {
            return Meetups.find({_id: topic.meetupId});
          }
        }
      }
    ]
  };
});

Meteor.publishComposite("topic", function(_id) {
  return {
    find: function() {
      return Topics.find({_id: _id});
    },
    children: [
      {
        find: function(topic) {
          return Meteor.users.find({_id: topic.userId});
        }
      },
      {
        find: function(topic) {
          if (topic.presented && topic.meetupId) {
            return Meetups.find({_id: topic.meetupId});
          }
        }
      },
      {
        find: function(topic) {
          return Comments.find({parentId: topic._id, parentType: 'topic'});
        },
        children: [
          {
            find: function(comment) {
              return Meteor.users.find({_id: comment.userId});
            }
          }
        ]
      }
    ]
  };
});

Meteor.publish("members", function () {
  return Meteor.users.find({}, {fields: {'profile': 1}});
});

Meteor.publishComposite("member", function(_id) {
  return {
    find: function() {
      return Meteor.users.find({_id: _id});
    },
    children: [
      {
        find: function(user) {
          return Activities.find({userId: user._id});
        }
      }
    ]
  };
});

Meteor.publish("presentations", function() {
  return Presentations.find({});
});

Meteor.publishComposite("presentation", function(_id) {
  return {
    find: function() {
      return Presentations.find({_id: _id});
    },
    children: [
      {
        find: function(presentation) {
          return Meteor.users.find({_id: presentation.userId});
        }
      },
      {
        find: function(presentation) {
          return Comments.find({parentId: presentation._id, parentType: 'presentation'});
        },
        children: [
          {
            find: function(comment) {
              return Meteor.users.find({_id: comment.userId});
            }
          }
        ]
      }
    ]
  };
});
