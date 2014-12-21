// We fetch the meetup API to get the list of social networks associated to
// this profile and add it to the user object.
Accounts.onCreateUser(function(options, user) {
  var userMeetupId = user.services.meetup.id;
  var api_key = Meteor.settings[Meteor.settings.environment].meetup.api_key;
  var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId;
  var userData = HTTP.get(requestUrl, {
    params: {
      key: api_key,
      signed: 'true',
      fields: 'other_services,',
      format: 'json'
    }
  });

  var thumbnailUrl;
  if(userData.photo && userData.photo.photo_link !== "") {
    thumbnailUrl = userData.photo.photo_link;
  } else {
    thumbnailUrl = "/default-avatar.png";
  }

  // XXX A `_.map` on `userData.other_services` would be cleaner
  var socialLinks = [];
  for (var service in userData.other_services) {
    if (service === "twitter") {
      var username = userData.other_services.twitter.identifier;
      socialLinks.push({
        service: 'twitter',
        url: 'https://twitter.com/' + username
      });
    } else if (service) {
      var url = userData.other_services[service].identifier;
      socialLinks.push({
        service: service,
        url: url
      });
    }
  }

  user.profile = {
    name: userData.name,
    meetupProfileUrl: userData.link,
    bio: userData.bio,
    socialLinks: socialLinks,
    thumbnailUrl: thumbnailUrl,
    meetupId: userMeetupId
  };

  return user;
});
