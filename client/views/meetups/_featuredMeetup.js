Template._featuredMeetup.helpers({
  featuredMeetup: function () {
    return Meetups.find({dateTime : {$gt : new Date()}, featured: true }, {sort: {dateTime: 1}, limit: 1});
  }
});
