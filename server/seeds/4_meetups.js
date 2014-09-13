Meteor.startup(function() {

  if (Meetups.find({}).count() === 0) {

    Meteor.call('MeetupAPI', 'getEvents', {"group_urlname": "Meteor-Las-Vegas", "status": "upcoming,past"}, function(err, response) {

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
  }

});
