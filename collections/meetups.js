Meetups = new Mongo.Collection('meetups');

Meetups.helpers({
  attendeesWithPhoto: function() {
    if (! this.attendeeIds)
      return [];

    var query = {
      _id: {
        $in: this.attendeeIds
      },
      "profile.thumbnailUrl": {
        $ne: "/default-avatar.png"
      }
    };
    var options = {
      sort: {
        "profile.points": -1,
        createdAt: 1
      }
    };

    return Meteor.users.find(query, options);
  },

  attendeesWithoutPhoto: function() {
    if (! this.attendeeIds)
      return [];

    var query = {
      _id: {
        $in: this.attendeeIds
      },
      "profile.thumbnailUrl": "/default-avatar.png"
    };
    var options = {
      sort: {
        "profile.points": -1,
        createdAt: 1
      }
    };

    return Meteor.users.find(query, options);
  },

  truncatedAttendees: function() {
    if (this.attendeeIds) {
      return Meteor.users.find({_id: {$in: this.attendeeIds}}, {limit: 5});
    }
  },

  numberOfOverflowAttendees: function() {
    if (this.attendeeIds) {
      return this.attendeeIds.length - 5;
    }
  },

  isPast: function() {
    return moment(this.dateTime).isBefore(moment());
  },

  topics: function() {
    return Topics.find({meetupId: this._id});
  }
});

Meetups.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
