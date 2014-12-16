var	list=["getCategories","getCheckins","postCheckin","getCities","getOpenEvents","getConcierge","getEvents","postEvent","getEventComments","postEventComment","postEventCommentFlag","getEventCommentLikes","getEventRatings","postEventRating","getEventAttendance","takeEventAttendance","getEverywhereComments","postEverywhereComment","getEverywhereCommunities","postEverywhereCommunity","getEverywhereFollows","getEverywhereFollowers","postEverywhereFollow","postEverywhereContainer","getEverywhereContainers","postEverywhereSeed","postEverywhereEvent","getEverywhereEvents","postEverywhereRsvp","getEverywhereRsvps","getEverywhereSeeds","getActivity","getGroups","getComments","getMembers","postMemberPhoto","postMessage","getOEMBed","getOEMBed","getPhotoComments","postPhotoComment","getPhotoAlbums","getPhoto","getPhotos","postPhotoAlbum","postPhoto","getProfiles","postProfiles","postRSVP","getRSVPs","getOpenVenues","getVenues","getTopics"],
	MeetupMe = Meteor.npmRequire("meetup-api");
	var api_key = Meteor.settings[Meteor.settings.environment].meetup.api_key;
	var group_urlname = Meteor.settings[Meteor.settings.environment].meetup.group_urlname;
	var meetup = new MeetupMe(api_key);
  var AsyncMeetup = Async.wrap(meetup, list);

Meteor.methods({
	MeetupAPI: function(endpoint, param) {
		switch(endpoint){
		case "getEvents":
			return AsyncMeetup.getEvents(param);
			break
		case "getProfiles":
			return AsyncMeetup.getProfiles(param);
			break
		case "getRSVPs":
			return AsyncMeetup.getRSVPs(param);
			break
		case "postRSVP" :
			AsyncMeetup.postRSVP(param); //Does not seem to be working, can't pass access token as headers
		default:

		}
	},

	fetchProfiles: function(offset) {
		var adminRoles = ["Organizer", "Co-Organizer"];

		offset = offset || 0;

		console.log ( "Fetching Meetup Member Profiles offset", offset);

		Meteor.call('MeetupAPI', 'getProfiles', {"offset": offset, "page": 200, "group_urlname": group_urlname, "fields":"other_services"}, function(err, response) {

			for (var i = 0, l = response.meta.count; i < l; i++) {
				var node = response.results[i];

				if(response.results[i].hasOwnProperty("photo") && response.results[i].photo.photo_link !== "") {
					var thumbnailUrl = response.results[i].photo.photo_link;
				} else {
					var thumbnailUrl = "/default-avatar.png";
				}

				var socialLinks = [];
				var userId;
				var meetupUid = response.results[i].member_id;
				for (service in response.results[i].other_services) {
					if(service === "twitter") {
						var username = response.results[i].other_services['twitter']['identifier'];
						socialLinks.push({'service': 'twitter', 'url': 'https://twitter.com/' + username});
					} else if(service) {
						var url = response.results[i].other_services[service]['identifier'];
						socialLinks.push({'service': service, 'url': url});
					}
				}

				var existingUser = Meteor.users.findOne({'profile.meetupId': meetupUid});
				if (existingUser) {

					userId = existingUser._id;
					Meteor.users.update({'profile.meetupId': meetupUid},
						{ $set :
							{
								'profile.name': response.results[i].name,
								'profile.bio': response.results[i].bio,
								'profile.meetupProfileUrl': response.results[i].profile_url,
								'profile.socialLinks': socialLinks,
								'profile.thumbnailUrl': thumbnailUrl,
								'profile.answers' : response.results[i].answers
							}
					});
				} else {
					userId = Meteor.users.insert({
						profile: {
							'meetupId': meetupUid,
							'name': response.results[i].name,
							'bio': response.results[i].bio,
							'meetupProfileUrl': response.results[i].profile_url,
							'socialLinks': socialLinks,
							'thumbnailUrl': thumbnailUrl,
							'answers' : response.results[i].answers
						},
						services: {
							meetup: {
								id: meetupUid
							}
						}
					});
				}

				//If the meetup user is in leadership team, then the json response will have a "role" variable returned with values such as "Organizer", "Co-Organizer" etc.
				if ( response.results[i].role ) {
					if (_(adminRoles).contains(response.results[i].role)) {
						Roles.addUsersToRoles(userId, ['admin']);
					}
				}
			}
			// we surely habe more than 200 profiles, get the next page
			if(response.meta.count == 200)
				Meteor.call("fetchProfiles", offset + 1);

		});
	},

	fetchEvents: function(status) {
		console.log ( "Fetching Meetup Events");
		Meteor.call('MeetupAPI', 'getEvents', {"group_urlname": group_urlname, "status": status, "fields":"featured"}, function(err, response) {

			for (var i = 0, l = response.meta.count; i < l; i++) {
				var meetupData = response.results[i];
				var existingMeetup = Meetups.findOne({meetupId: meetupData['id']});
				var meetupDocId; //Mongo doc _id of meetup document. This is not the meetup.com's meetupId

				if (existingMeetup) {
					meetupDocId = existingMeetup._id;
					Meetups.update({_id: existingMeetup._id}, {
						$set: {
							title: meetupData['name'],
							description: meetupData['description'],
							meetupId: meetupData['id'],
							meetupUrl: meetupData['event_url'],
							featured : meetupData['featured'],
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
						featured : meetupData['featured'],
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
							var meetup = Meetups.findOne({_id:meetupDocId});
							if (!Activities.findOne({userId: user._id, subjectId: meetupDocId, type: 'rsvp'})) {
								Meetups.update({_id: meetupDocId}, {$addToSet: {'attendeeIds': user._id}});
								Activities.insert({
									userId: user._id,
									subjectId: meetupDocId,
									subjectTitle: meetupData['name'],
									subjectType: 'meetup',
									type: 'rsvp'
								});
							}
						}
					}
				});
			}
		});
	},

	doRSVP : function(eventId) {
		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(403, {'status':'error', 'code':'not-logged-in', 'errorTitle':'Not logged in', 'errorDesc':'You are not logged in to RSVP.'});

		// If user is not a member, let the client redirect the user to join page ?
		if (!user.profile.meetupId) {
			throw new Meteor.Error(403, {'status':'error', 'code':'not-a-member','errorTitle': 'Not a Member', 'errorDesc':'You are not a member of this group.'});
		} else {
			var meetupUserId = user.profile.meetupId;
			//Ref: http://www.meetup.com/meetup_api/auth/
			HTTP.call("POST" , "https://api.meetup.com/2/rsvp/",
				{
					params: {'event_id' : eventId, 'rsvp' : 'yes', 'key':api_key},
					headers:{"Accept":"*/*", "User-Agent": "Meetup API lib for Node.js 0.1.3", "Authorization" : "bearer " + user.services["meetup"].accessToken}
				},
        function(error, response) {
        	if (error) {
        		//handle error here
        		throw new Meteor.Error(403, {'status':'error', 'code':'unknown-error', 'errorTitle':'Unknown Error', 'errorDesc':'There was an error processing this RSVP.'});
        	}
        	else {
        		if (user) {
        			var meetup = Meetups.findOne({meetupId:eventId});
        			var rsvpData = response.data;
        			if (rsvpData.response === 'yes') { // Potential responses: "yes", "no", "waitlist" or "yes_pending_payment"
        				if (!Activities.findOne({
        					userId: user._id,
        					subjectId: meetup._id,
        					type: 'rsvp'
        				})) {
        					Meetups.update({ meetupId: eventId }, { $addToSet: { 'attendeeIds': user._id } });
        					Activities.insert({
        						userId: user._id,
        						subjectId: meetup._id,
        						subjectTitle: rsvpData.event.name,
        						subjectType: 'meetup',
        						type: 'rsvp'
        					});
        				}
        			}

        		}
        	}
        }
      );
		}
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
			Meetups.update({_id: params.meetupDocId}, {$addToSet: {'attendeeIds': Meteor.userId()}})

			var meetup = Meetups.findOne(params.meetupDocId);
			Activities.insert({
				userId: Meteor.userId(),
				subjectId: meetup._id,
				subjectTitle: meetup.title,
				subjectType: 'meetup',
				type: 'rsvp'
			});
		}
	},

	addTopicToMeetup: function(params) {
		if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin'])) {
			if (params.topicId) {
				Topics.update({_id: params.topicId}, {$set: {
					meetupId: params.meetupId,
					presented: true,
					presenterId: params.presenterId
				}});
			} else {
				Topics.insert({
					title: params.customTitle,
					description: params.customDescription,
					meetupId: params.meetupId,
					presented: true,
					presenterId: params.presenterId,
					userId: Meteor.userId(),
					points: 0
				});
			}

			var title = "";
			if (params.topicId) {
				var topic = Topics.findOne(params.topicId);
				title = topic.title;
			} else {
				title = params.customTitle;
			}
			Activities.insert({
				userId: params.presenterId,
				subjectId: params.topicId,
				subjectTitle: title,
				subjectType: 'topic',
				type: 'presented_topic'
			});
		}
	}
});
