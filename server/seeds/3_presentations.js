Meteor.startup(function() {

  if (Presentations.find({}).count() === 0) {

    function getRandomDate(from, to) {
        if (!from) {
            from = new Date(2014, 0, 1).getTime();
        } else {
            from = from.getTime();
        }
        if (!to) {
            to = new Date(2015, 0, 1).getTime();
        } else {
            to = to.getTime();
        }
        return new Date(from + Math.random() * (to - from));
    }

    function getRandomUser() {
      var users = Meteor.users.find().fetch();
      var userCount = Meteor.users.find().count();
      randomIndex = _.random(0, userCount-1);
      return users[randomIndex];
    }

    var randomUser1 = getRandomUser();
    var randomUser2 = getRandomUser();
    var randomUser3 = getRandomUser();

    var presentations = [
      {
        title: "Meteor on Mobile",
        presenter: { _id:randomUser1._id, name: randomUser1.profile.name},
        presentationDate: getRandomDate(),
        tags: ["mobile"],
        status:"presented"
      },
      {
        title: "Meteor UI Components",
        presenter: { _id:randomUser2._id, name: randomUser2.profile.name},
        presentationDate: getRandomDate(),
        tags:["ui"],
        status:"scheduled"
      },
      {
        title: "Custom Packages",
        presenter: { _id:randomUser3._id, name: randomUser3.profile.name},
        presentationDate: getRandomDate(),
        tags:["packages"],
        status:"presented"
      }
    ];

    for (var i = 0; i < presentations.length; i++) {
      var presentation = presentations[i];
      var presentationId = Presentations.insert(presentation);
    }

  }

});
