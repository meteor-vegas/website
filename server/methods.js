var	list=["getCategories","getCheckins","postCheckin","getCities","getOpenEvents","getConcierge","getEvents","postEvent","getEventComments","postEventComment","postEventCommentFlag","getEventCommentLikes","getEventRatings","postEventRating","getEventAttendance","takeEventAttendance","getEverywhereComments","postEverywhereComment","getEverywhereCommunities","postEverywhereCommunity","getEverywhereFollows","getEverywhereFollowers","postEverywhereFollow","postEverywhereContainer","getEverywhereContainers","postEverywhereSeed","postEverywhereEvent","getEverywhereEvents","postEverywhereRsvp","getEverywhereRsvps","getEverywhereSeeds","getActivity","getGroups","getComments","getMembers","postMemberPhoto","postMessage","getOEMBed","getOEMBed","getPhotoComments","postPhotoComment","getPhotoAlbums","getPhoto","getPhotos","postPhotoAlbum","postPhoto","getProfiles","postProfiles","postRSVP","getRSVPs","getOpenVenues","getVenues","getTopics"],
	MeetupMe = Meteor.npmRequire("meetup-api"),
	meetup = new MeetupMe("376915111a5224393a202e7e1d474031");
  AsyncMeetup = Async.wrap(meetup, list);

Meteor.methods({
	MeetupAPI: function(endpoint, param) {
		switch(endpoint){
		case "getEvents":
			return AsyncMeetup.getEvents(param);
			break
		case "getMembers":
			return AsyncMeetup.getMembers(param);
			break
		case "getRSVPs":
			return AsyncMeetup.getRSVPs(param);
			break
		default:

		}
	},

	fetchMembers: function() {
		var adminIds = [54118672, 57771272, 32213572, 28932772, 87620262, 11527138, 8187187];

		Meteor.call('MeetupAPI', 'getMembers', {"group_urlname": "Meteor-Las-Vegas"}, function(err, response) {

			for (var i = 0, l = response.meta.count; i < l; i++) {
				var node = response.results[i];

				if(response.results[i].hasOwnProperty("photo") && response.results[i].photo.photo_link !== "") {
					var thumbnailUrl = response.results[i].photo.photo_link;
				} else {
					var thumbnailUrl = "/default-avatar.png";
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

				var existingUser = Meteor.users.findOne({'profile.meetupId': response.results[i].id});

				if (existingUser) {
					existingUser.update({'profile.meetupId': response.results[i].id}, {
						profile: {
							'name': response.results[i].name,
							'bio': response.results[i].bio,
							'meetupProfileUrl': response.results[i].link,
							'socialLinks': socialLinks,
							'thumbnailUrl': thumbnailUrl
						}
					});
				} else {
					var userId = Meteor.users.insert({
						createdAt: new Date(),
						profile: {
							'meetupId': response.results[i].id,
							'name': response.results[i].name,
							'bio': response.results[i].bio,
							'meetupProfileUrl': response.results[i].link,
							'socialLinks': socialLinks,
							'thumbnailUrl': thumbnailUrl,
							'points': _.random(5, 25)
						},
						services: {
							meetup: {
								id: response.results[i].id
							}
						}
					});
				}

				if (_(adminIds).contains(response.results[i].id)) {
					Roles.addUsersToRoles(userId, ['admin']);
					Meteor.users.update({_id: userId}, {$set: {'profile.points': _.random(100, 500)}});
				}

			}
		});
	},

	fetchEvents: function(status) {
		Meteor.call('MeetupAPI', 'getEvents', {"group_urlname": "Meteor-Las-Vegas", "status": status}, function(err, response) {

			for (var i = 0, l = response.meta.count; i < l; i++) {
				var meetupData = response.results[i];
				var existingMeetup = Meetups.findOne({meetupId: meetupData['id']});
				var meetupId;

				if (existingMeetup) {
					meetupId = Meetups.update({meetupId: meetupData['id']}, {
						title: meetupData['name'],
						description: meetupData['description'],
						meetupId: meetupData['id'],
						meetupUrl: meetupData['event_url'],
						dateTime: moment(meetupData['time']).toDate(),
						location: {
							name: meetupData['venue']['name'],
							address: meetupData['venue']['address_1'],
							lat: meetupData['venue']['lat'],
							lon: meetupData['venue']['lon']
						}
					});
				} else {
					console.log('Meetups.insert');
					meetupId = Meetups.insert({
						title: meetupData['name'],
						description: meetupData['description'],
						meetupId: meetupData['id'],
						meetupUrl: meetupData['event_url'],
						dateTime: moment(meetupData['time']).toDate(),
						location: {
							name: meetupData['venue']['name'],
							address: meetupData['venue']['address_1'],
							lat: meetupData['venue']['lat'],
							lon: meetupData['venue']['lon']
						}
					});
				}

				Meteor.call('MeetupAPI', 'getRSVPs', {"event_id": meetupData['id'], "rsvp": "yes"}, function(err, response) {
					console.log('getRSVPs');
					for (var j = 0, l = response.meta.count; j < l; j++) {
						var rsvpData = response.results[j];
						var meetupUserId = rsvpData['member']['member_id'];
						var user = Meteor.users.findOne({'profile.meetupId': meetupUserId});
						if (user) {
							Meetups.update({_id: meetupId}, {$push: {'attendeeIds': user._id}});
						}
					}
				});
			}
		});
	},

	createTopic: function(params) {
		Topics.insert({
			_id: params._id,
			title: params.title,
			description: params.description,
			userId: Meteor.userId(),
			points: 0,
			createdAt: new Date()
		});
	},

	createComment: function(params) {
		Comments.insert({
			body: params.body,
			parentType: params.parentType,
			parentId: params.parentId,
			userId: Meteor.userId(),
			createdAt: new Date()
		});

		if (params.parentType === 'topic') {
			Topics.update({_id: params.parentId}, {$inc: {numberOfComments: 1}});
		}
		if (params.parentType === 'presentation') {
			Presentations.update({_id: params.parentId}, {$inc: {numberOfComments: 1}});
		}
	},

	rsvp: function(params) {
		if (Meteor.userId()) {
			Meetups.update({_id: params.meetupId}, {$push: {'attendeeIds': Meteor.userId()}})
		}
	}
});
