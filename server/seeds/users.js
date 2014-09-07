Meteor.startup(function() {

  if (Meteor.users.find({}).count() === 0) {

    Meteor.call('MeetupAPI', 'getMembers', {"group_urlname": "Meteor-Las-Vegas"}, function(err, response) {

      console.log('User Count: ' + JSON.stringify(response.meta.count));
      for (var i = 0, l = response.meta.count; i < l; i++) {
        var node = response.results[i];
        console.log('name: ' + node.name + ' id: ' + node.id);

        if(response.results[i].hasOwnProperty("photo")) {
          var thumbnailUrl = response.results[i].photo.thumb_link;
        } else {
          console.log('has photo: ' + response.results[i].hasOwnProperty("photo"));
          var thumbnailUrl = "default-avatar.jpg";
        }

        Meteor.users.insert({
          createdAt: new Date(),
          profile: {
            'name': response.results[i].name,
            'bio': response.results[i].bio,
            'link': response.results[i].link,
            'thumbnailUrl': thumbnailUrl,
          },
          services: {
            meetup: {
              id: response.results[i].id
            }
          }
        });

      }
    });

  }

});
