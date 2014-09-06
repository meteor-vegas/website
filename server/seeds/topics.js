Meteor.startup(function() {

  if (Topics.find({}).count() === 0) {

    var topics = [
      {
        title: "Meteor on Mobile",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      },
      {
        title: "Meteor UI Components",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      },
      {
        title: "Custom Packages",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      }
    ];

    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      var topicId = Topics.insert({
        title: topic.title,
        description: topic.description,
        tags: topic.tags,
        eventId: null
      });
    }

  }

});
