Meteor.users.helpers({
  activities: function() {
    return Activities.find({userId: this._id}, {sort: {createdAt: -1}});
  }
});

Meteor.users.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
  doc.profile.points = 0;
});
