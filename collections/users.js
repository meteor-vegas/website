Meteor.users.helpers({
  activities: function() {
    return Activities.find({userId: this._id}, {sort: {createdAt: -1}});
  }
});

Meteor.users.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
  if (doc.profile && !doc.profile.thumbnailUrl) {
    doc.profile.thumbnailUrl = "/default-avatar.png";
  }
  doc.profile.points = 0;
});
