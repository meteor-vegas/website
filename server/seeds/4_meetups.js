Meteor.startup(function() {

  if (Meetups.find({}).count() === 0) {

    Meteor.call('MeetupAPI', 'getEvents', {"group_urlname": "Meteor-Las-Vegas", "status": "upcoming,past"}, function(err, response) {

      for (var i = 0, l = response.meta.count; i < l; i++) {
        var node = response.results[i];
        var existingMeetup = Meetups.findOne({meetupId: node['id']});

        if (existingMeetup) {
          Meetups.update({meetupId: node['id']}, {
            title: node['name'],
            description: node['description'],
            meetupId: node['id'],
            meetupUrl: node['event_url'],
            dateTime: moment(node['time']).toDate(),
            location: {
              name: node['venue']['name'],
              address: node['venue']['address_1'],
              lat: node['venue']['lat'],
              lon: node['venue']['lon']
            }
          });
        } else {
          Meetups.insert({
            title: node['name'],
            description: node['description'],
            meetupId: node['id'],
            meetupUrl: node['event_url'],
            dateTime: moment(node['time']).toDate(),
            location: {
              name: node['venue']['name'],
              address: node['venue']['address_1'],
              lat: node['venue']['lat'],
              lon: node['venue']['lon']
            }
          });
        }

      }
    });
  }

});
