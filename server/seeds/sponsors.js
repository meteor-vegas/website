Meteor.startup(function() {

  if (sponsors.find({}).count() === 0) {

    var sponsors = [
      {
        title: "Meteor.js",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        logo: "http://placehold.it/350x150"
      },
      {
        title: "Beer",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        logo: "http://lorempixel.com/350/150/nightlife/9/"
      },
      {
        title: "Music",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        logo: "http://lorempixel.com/350/150/technics/5/"
      }

    ];

    for (var i = 0; i < sponsors.length; i++) {
      var sponsor = sponsors[i];
      var sponsorId = Sponsors.insert({
        title: sponsor.title,
        description: sponsor.description,
        tags: sponsor.tags,
        meteorGroupId = "",
        eventId: null
      });
    }

  }

});
