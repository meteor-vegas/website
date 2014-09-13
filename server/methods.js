var	list=["getCategories","getCheckins","postCheckin","getCities","getOpenEvents","getConcierge","getEvents","postEvent","getEventComments","postEventComment","postEventCommentFlag","getEventCommentLikes","getEventRatings","postEventRating","getEventAttendance","takeEventAttendance","getEverywhereComments","postEverywhereComment","getEverywhereCommunities","postEverywhereCommunity","getEverywhereFollows","getEverywhereFollowers","postEverywhereFollow","postEverywhereContainer","getEverywhereContainers","postEverywhereSeed","postEverywhereEvent","getEverywhereEvents","postEverywhereRsvp","getEverywhereRsvps","getEverywhereSeeds","getActivity","getGroups","getComments","getMembers","postMemberPhoto","postMessage","getOEMBed","getOEMBed","getPhotoComments","postPhotoComment","getPhotoAlbums","getPhoto","getPhotos","postPhotoAlbum","postPhoto","getProfiles","postProfiles","postRSVP","getRSVPs","getOpenVenues","getVenues","getTopics"],
	MeetupMe = Meteor.require("meetup-api"),
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
