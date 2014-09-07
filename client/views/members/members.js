Meteor.subscribe("members");

Template.members.rendered = function() {
  document.title = 'Members | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};
<<<<<<< HEAD
=======


Template.members.helpers({
  post: function() {
    //console.log("Post");
	var posts = [];
    var _i = 0;
    Meteor.users.find({}, {sort: ["profile.name", "asc"]}).forEach(function(p) {
      p.position = _i;
      _i++;
      posts.push(p);
    });
    return posts;
  },
  odd: function() {
	  //console.log("Odd");
	return !(this.position % 2 === 0);
  },
  even: function() {
	  //console.log("Even");
    return (this.position % 2 === 0);
  }
});

Template.members.events({
    'click .createMembers': function () {
    	Meteor.call('MeetupAPI','getMembers',{"group_urlname": "Meteor-Las-Vegas"}, function(err, response) {
			console.log('User Count: ' + JSON.stringify(response.meta.count));
			
			for (var i = 0, l = response.meta.count; i < l; i++) {
			        var node = response.results[i];
					
					console.log('name: ' + node.name + ' id: ' + node.id);
					
					if(response.results[i].hasOwnProperty("photo")) {
						var thumb_link = response.results[i].photo.thumb_link;
					} else {
						console.log('has photo: ' + response.results[i].hasOwnProperty("photo"));
						var thumb_link = "no_image.jpg";
						
					}
								
					Meteor.users.insert({
					  createdAt: new Date(),
					  profile: {
					    'name': response.results[i].name,
						'bio': response.results[i].bio,
						'link': response.results[i].link,
						'thumb_link': thumb_link, 
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

Template.members.members = function () {

//results = Meteor.users.find({});

  return Meteor.users.find({});
	
};



>>>>>>> members
