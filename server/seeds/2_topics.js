Meteor.startup(function() {

  if (Topics.find({}).count() === 0) {

    var userIds = _(Meteor.users.find({}).fetch()).pluck('_id');

    var topics = [
      {
        title: "Meteor on Mobile with Cordova",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-09-01",
        points: 10
      },
      {
        title: "Building Meteor UI Components",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-08-01",
        points: 8
      },
      {
        title: "Creating Custom Packages",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-07-01",
        points: 6
      },
      {
        title: "Testing Meteor Apps with Velocity",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-06-01",
        points: 4
      }
    ];

    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      var numberOfComments = _.random(0, 10);

      var topicId = Topics.insert({
        title: topic.title,
        description: topic.description,
        tags: topic.tags,
        eventId: null,
        createdAt: moment(topic.date).toDate(),
        points: topic.points,
        userId: _(userIds).sample(),
        numberOfComments: numberOfComments
      });


      for (var j = 0; j < numberOfComments; j++) {
        Comments.insert({
          parentType: 'topic',
          parentId: topicId,
          userId: _(userIds).sample(),
          body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
          createdAt: moment(topic.date).subtract(j, 'days').toDate()
        });
      }
    }
  }

});
