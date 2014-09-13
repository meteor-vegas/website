Meteor.startup(function() {

  if (Meteor.users.find({}).count() === 0) {

    var adminIds = [54118672, 57771272, 32213572, 28932772, 87620262, 11527138, 8187187];

    Meteor.call('MeetupAPI', 'getMembers', {"group_urlname": "Meteor-Las-Vegas"}, function(err, response) {

      for (var i = 0, l = response.meta.count; i < l; i++) {
        var node = response.results[i];

        if(response.results[i].hasOwnProperty("photo")) {
          var thumbnailUrl = response.results[i].photo.photo_link;
        } else {
          var thumbnailUrl = "default-avatar.png";
        }

        var socialLinks = [];
        for (service in response.results[i].other_services) {
          if(service === "twitter") {
            var username = response.results[i].other_services['twitter']['identifier'];
            socialLinks.push({'service': 'twitter', 'url': 'https://twitter.com/' + username});
          } else if(service) {
            var url = response.results[i].other_services[service]['identifier'];
            socialLinks.push({'service': service, 'url': url});
          }
        }

        var userId = Meteor.users.insert({
          createdAt: new Date(),
          profile: {
            'meetupId': response.results[i].id,
            'name': response.results[i].name,
            'bio': response.results[i].bio,
            'meetupProfileUrl': response.results[i].link,
            'socialLinks': socialLinks,
            'thumbnailUrl': thumbnailUrl,
            'points': _.random(5, 250)
          },
          services: {
            meetup: {
              id: response.results[i].id
            }
          }
        });

        if (_(adminIds).contains(response.results[i].id)) {
          Roles.addUsersToRoles(userId, ['admin'])
        }

      }
    });

  }

});
