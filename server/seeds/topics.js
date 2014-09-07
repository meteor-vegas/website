Meteor.startup(function() {

  if (Topics.find({}).count() === 0) {

    var topics = [
      {
        title: "Meteor on Mobile",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-09-01",
        points: 10
      },
      {
        title: "Meteor UI Components",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-08-01",
        points: 8
      },
      {
        title: "Custom Packages",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "2014-07-01",
        points: 6
      }
    ];

    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      var topicId = Topics.insert({
        title: topic.title,
        description: topic.description,
        tags: topic.tags,
        eventId: null,
        createdAt: new Date(topic.date),
        points: topic.points
      });
    }
  }

});
