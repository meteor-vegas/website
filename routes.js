Router.map(function() {
  this.route('home', {
    path: '/'
  });

  this.route('meetups', {
    path: '/meetups'
  });
  this.route('meetupDetail', {
    path: '/meetups/id-goes-here'
  });

  this.route('topics', {
    path: '/topics',
    waitOn: function() {
      return this.subscribe("topics");
    },
    data: {
      topics: Topics.find({}, {sort: {points: -1}})
    }
  });
  this.route('topicDetail', {
    path: '/topics/:_id',
    waitOn: function() {
      return this.subscribe("topic", this.params._id);
    },
    data: function() {
      return {
        topic: Topics.findOne({_id: this.params._id})
      };
    }
  });

  this.route('members', {
    path: '/members',
    waitOn: function() {
      return this.subscribe("members");
    },
    data: {
      members: Meteor.users.find({}, {sort: {'profile.points': -1}})
    }
  });
  this.route('memberDetail', {
    path: '/members/:_id',
    waitOn: function() {
      return this.subscribe("member", this.params._id);
    },
    data: function() {
      return {
        member: Meteor.users.findOne({_id: this.params._id})
      };
    }
  });

  this.route('notFound', {
    path: '*',
    where: 'server',
    action: function() {
      this.response.statusCode = 404;
      this.response.end(Handlebars.templates['404']());
    }
  });
});
