Meteor.users.helpers({
  activities: function() {
    return Activities.find({userId: this._id}, {sort: {createdAt: -1}});
  },

  social: function() {
    var ret = this.profile.socialLinks;
    var icon;

    _.each(ret, function(link, index) {
      if (link.service === 'flickr') {
        // Looks most like a photo, and Flickr is a photo publishing site.
        icon = 'image';
      } else {
        icon = "social-" + link.service;
      }
      ret[index].icon = icon;
    });

    return ret;
  }
});

Meteor.users.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
  if (doc.profile && !doc.profile.thumbnailUrl) {
    doc.profile.thumbnailUrl = "/default-avatar.png";
  }
  doc.profile.points = 0;
});
