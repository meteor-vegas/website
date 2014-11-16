Template._featuredMeetup.helpers(function(){
  featuredMeetup: {
    return Meetups.find({dateTime : {$gt : new Date()}, featured: true }, {sort: {dateTime: 1}, limit: 1})
  }
});
