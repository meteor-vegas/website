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
						profile: {
							'meetupId': response.results[i].id,
							'name': response.results[i].name,
							'bio': response.results[i].bio,
							'meetupProfileUrl': response.results[i].link,
							'socialLinks': socialLinks,
							'thumbnailUrl': thumbnailUrl
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
					meetupId = Meetups.update({_id: existingMeetup._id}, {
						$set: {
							title: meetupData['name'],
							description: meetupData['description'],
							meetupId: meetupData['id'],
							meetupUrl: meetupData['event_url'],
							dateTime: moment(meetupData['time']).toDate(),
							location: {
								name: meetupData['venue']['name'],
								address: meetupData['venue']['address_1'],
								lat: meetupData['venue']['lat'],
								lon: meetupData['venue']['lon'],
								description: meetupData['how_to_find_us']
							}
						}
					});
				} else {
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
							lon: meetupData['venue']['lon'],
							description: meetupData['how_to_find_us']
						}
					});
				}

				Meteor.call('MeetupAPI', 'getRSVPs', {"event_id": meetupData['id'], "rsvp": "yes"}, function(err, response) {
					for (var j = 0, l = response.meta.count; j < l; j++) {
						var rsvpData = response.results[j];
						var meetupUserId = rsvpData['member']['member_id'];
						var user = Meteor.users.findOne({'profile.meetupId': meetupUserId});
						if (user) {
							Meetups.update({_id: meetupId}, {$push: {'attendeeIds': user._id}});
							Activities.insert({
								userId: user._id,
								subjectId: meetupData['id'],
								subjectTitle: meetupData['name'],
								subjectType: 'meetup',
								type: 'rsvp'
							});
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
			points: 0
		});
	},

	createComment: function(params) {
		Comments.insert({
			body: params.body,
			parentType: params.parentType,
			parentId: params.parentId,
			userId: Meteor.userId()
		});

		if (params.parentType === 'topic') {
			Topics.update({_id: params.parentId}, {$inc: {numberOfComments: 1}});
		}
		if (params.parentType === 'presentation') {
			Presentations.update({_id: params.parentId}, {$inc: {numberOfComments: 1}});
		}

		var activityType = 'commented_on_' + params.parentType;
		Activities.insert({
			userId: Meteor.userId(),
			subjectId: params.parentId,
			subjectType: params.parentType,
			subjectTitle: params.parentTitle,
			type: activityType
		});
	},

	voteOnTopic: function(topic) {
		var points = topic.points + 1;
		Topics.update({_id: topic._id}, {$set: {points: points}});
		Meteor.users.update({_id: Meteor.userId()}, {$push: {'profile.votedTopicIds': topic._id}});

		Activities.insert({
			userId: Meteor.userId(),
			subjectId: topic._id,
			subjectTitle: topic.title,
			subjectType: 'topic',
			type: 'voted_on_topic'
		});
	},

	likePresentation: function(presentation) {
		Meteor.users.update({_id: Meteor.userId()}, { $addToSet: {'profile.likedItemIds' : presentation._id} } );

		Activities.insert({
			userId: Meteor.userId(),
			subjectId: presentation._id,
			subjectTitle: presentation.title,
			subjectType: 'presentation',
			type: 'liked_presentation'
		});
	},

	rsvp: function(params) {
		if (Meteor.userId()) {
			Meetups.update({_id: params.meetupId}, {$push: {'attendeeIds': Meteor.userId()}})

			var meetup = Meetups.findOne(params.meetupId);
			Activities.insert({
				userId: Meteor.userId(),
				subjectId: meetup._id,
				subjectTitle: meetup.title,
				subjectType: 'meetup',
				type: 'rsvp'
			});
		}
	}
});
