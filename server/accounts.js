Meteor.startup(function() {

  Accounts.onCreateUser(function(options, user) {
    var userMeetupId = user.services.meetup.id;
    var api_key = Meteor.settings[Meteor.settings.environment].meetup.api_key;
    var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId + '?key=' + api_key + '&signed=true&fields=other_services';
    var response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });
    var userData = response.data;

    if(userData.hasOwnProperty("photo") && userData.photo.photo_link !== "") {
      var thumbnailUrl = userData.photo.photo_link;
    } else {
      var thumbnailUrl = "/default-avatar.png";
    }

    var socialLinks = [];
    for (service in userData.other_services) {
      if(service === "twitter") {
        var username = userData.other_services['twitter']['identifier'];
        socialLinks.push({'service': 'twitter', 'url': 'https://twitter.com/' + username});
      } else if(service) {
        var url = userData.other_services[service]['identifier'];
        socialLinks.push({'service': service, 'url': url});
      }
    }

    options.profile = {
      'name': userData.name,
      'meetupProfileUrl': userData.link,
      'bio': userData.bio,
      'socialLinks': socialLinks,
      'thumbnailUrl': thumbnailUrl,
      'meetupId': userMeetupId
    };
    user.profile = options.profile;
    return user;
  });

});
