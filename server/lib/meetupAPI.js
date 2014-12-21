// We wrap the complete list of methods provided by the NPM Meetup API into the
// Async wrapper so we can use it in a synchronous/fiber style on the server.

var MeetupMe = Meteor.npmRequire("meetup-api");

var list = ["getCategories", "getCheckins", "postCheckin", "getCities",
"getOpenEvents", "getConcierge", "getEvents", "postEvent", "getEventComments",
"postEventComment", "postEventCommentFlag", "getEventCommentLikes",
"getEventRatings", "postEventRating", "getEventAttendance",
"takeEventAttendance", "getEverywhereComments", "postEverywhereComment",
"getEverywhereCommunities", "postEverywhereCommunity", "getEverywhereFollows",
"getEverywhereFollowers", "postEverywhereFollow", "postEverywhereContainer",
"getEverywhereContainers", "postEverywhereSeed", "postEverywhereEvent",
"getEverywhereEvents", "postEverywhereRsvp", "getEverywhereRsvps",
"getEverywhereSeeds", "getActivity", "getGroups", "getComments", "getMembers",
"postMemberPhoto", "postMessage", "getOEMBed", "getOEMBed", "getPhotoComments",
"postPhotoComment", "getPhotoAlbums", "getPhoto", "getPhotos", "postPhotoAlbum",
"postPhoto", "getProfiles", "postProfiles", "postRSVP", "getRSVPs",
"getOpenVenues", "getVenues", "getTopics"];

// XXX The way we manage environment is not consistent with server/auth.js
var environment = Meteor.settings.environment;
var api_key = Meteor.settings[environment].meetup.api_key;
var meetup = new MeetupMe(api_key);
AsyncMeetup = Async.wrap(meetup, list);
