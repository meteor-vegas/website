Meteor.subscribe("members");

Template.members.rendered = function() {
  document.title = 'Members | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};

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
						var thumb_link = "no-image.gif";
						
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

Template.members.odd = function () {

var results = Meteor.users.find({});
var rCount = results.count();
 newResultsOdd = [];
 newResultsEven = [];
newResults = [];

for (var i=0; i < rCount; i++) {
	var tempResult = results.fetch()[i];
        
		if (!(i % 2 === 0)){
        	newResultsOdd.push(results.fetch()[i]);
        } else {
        	newResultsEven.push(results.fetch()[i]);
        }
		
  }
//newResults.push(newResultsOdd);
//newResults.push(newResultsEven);

  return newResultsOdd;
	
};

Template.members.members = function () {

results = Meteor.users.find({});

  return Meteor.users.find({});
	
};

Template.members.helpers = {
  post: function() {
    posts = [];
    var _i = 0;
    Meteor.users.find().forEach(function(p) {
      p.position = _i;
      _i++;
      posts.push(p);
    });
    return posts;
  },
  odd: function() {
    return Meteor.users.find();
  },
  even: function() {
    return (this.position % 2 === 0);
  }
}
