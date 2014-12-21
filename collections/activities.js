Activities = new Mongo.Collection('activities');

ACTIVITY_POINTS = {
  'liked_presentation': 5,
  'commented_on_presentation': 5,
  'created_presentation': 10,
  'voted_on_topic': 5,
  'commented_on_topic': 5,
  'created_topic': 10,
  'presented_topic': 50,
  'rsvp': 10,
  'custom': 0
};

ACTIVITY_ICONS = {
  'liked_presentation': 'ion-heart',
  'commented_on_presentation': 'ion-ios7-chatbubble',
  'created_presentation': 'ion-plus',
  'voted_on_topic': 'ion-arrow-up-c',
  'commented_on_topic': 'ion-ios7-chatbubble',
  'created_topic': 'ion-plus',
  'presented_topic': 'ion-mic-a',
  'custom': 'ion-flash',
  'rsvp': 'ion-checkmark'
};

Activities.helpers({
  subjectURL: function() {
    switch (this.subjectType) {
      case 'topic':
        return Router.routes.topicDetail.path({
          _id: this.subjectId
        });
      case 'presentation':
        return Router.routes.presentationDetail.path({
          _id: this.subjectId
        });
      case 'meetup':
        return Router.routes.meetupDetail.path({
          _id: this.subjectId
        });
    }
  },

  actionDescription: function() {
    switch (this.type) {
      case 'liked_presentation':
        return 'Liked a presentation: ';
      case 'commented_on_presentation':
        return 'Commented on a presentation: ';
      case 'created_presentation':
        return 'Added a presentation: ';
      case 'voted_on_topic':
        return 'Voted on a topic: ';
      case 'commented_on_topic':
        return 'Commented on a topic: ';
      case 'created_topic':
        return 'Suggested a topic: ';
      case 'presented_topic':
        return 'Presented a topic: ';
      case 'rsvp':
        return 'RSVP\'d to a meetup: ';
    }
  },

  isTypeCustom: function() {
    return this.type === 'custom';
  },

  pointsAwarded: function() {
    return ACTIVITY_POINTS[this.type];
  },

  icon: function() {
    return ACTIVITY_ICONS[this.type];
  }
});

Activities.before.insert(function(userId, doc) {
  doc.createdAt = moment().toDate();
});

Activities.after.insert(function(userId, doc) {
  var points = doc.type !== 'custom' ? ACTIVITY_POINTS[doc.type] : doc.points;
  if (points) {
    Meteor.users.update(doc.userId, {
      $inc: {
        'profile.points': points
      }
    });
  }
});

Activities.after.remove(function(userId, doc) {
  var points = doc.type !== 'custom' ? ACTIVITY_POINTS[doc.type] : doc.points;
  if (points) {
    Meteor.users.update(doc.userId, {
      $inc: {
        'profile.points': -points
      }
    });
  }
});
