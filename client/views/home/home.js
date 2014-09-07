Meteor.subscribe("members");

Template.home.rendered = function() {
  document.title = 'Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  $('[data-toggle=tooltip]').tooltip();
};

Template._home.top_members = function (){

	return Meteor.users.find({}, {fields: {profile: 1}, sort: {'profile.points': -1}, limit: 6} );
	
};
