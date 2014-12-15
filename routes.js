var subs = new SubsManager();

Router.options.loadingTemplate = new Blaze.Template('loadingTemplate', function () {
  return TAPi18n.__('loading_page');
});

Router.options.notFoundTemplate = new Blaze.Template('notFoundTemplate', function () {
  return TAPi18n.__('data_not_found');
});

Router.map(function() {
  this.route('home', {
    path: '/',
    waitOn: function() {
      return subs.subscribe("meetups");
    },
    data: {
      upcomingMeetup: Meetups.find({dateTime : {$gt : new Date()} }, {sort: {dateTime: 1}, limit: 1}),
      sponsors : Meteor.settings.public.sponsors,
      projects: Meteor.settings.public.projects,
      subcontractors: Meteor.settings.public.subcontractors
    }
  });

  this.route('meetups', {
    path: '/meetups',
    waitOn: function() {
      return subs.subscribe("meetups");
    },
    data: {
      groupName : Meteor.settings.public.meetup.group_name,
      upcomingMeetup: Meetups.find({dateTime : {$gt : new Date()} }, {sort: {dateTime: 1}, limit: 1}),
      previousMeetups: Meetups.find({dateTime : {$lt : new Date()} }, {sort: {dateTime: -1}})
    },
    onAfterAction: function() {
      SEO.set({
        title: 'Meetups | ' + SEO.settings.title
      });
    }
  });

  this.route('meetupDetail', {
    path: '/meetups/:_id',
    waitOn: function() {
      return [
        subs.subscribe("meetup", this.params._id),
        subs.subscribe("suggestedTopics"),
        subs.subscribe("members")
      ];
    },
    data: function() {
      return {
        groupName : Meteor.settings.public.meetup.group_name,
        meetup: Meetups.findOne({_id: this.params._id}),
        suggestedTopics: Topics.find({presented: {$ne: true}}, {sort: {points: -1}}),
        members: Meteor.users.find({}, {sort: {'profile.points': -1}})
      };
    },
    onAfterAction: function() {
      if(this.ready()) {
        SEO.set({
          title: this.data().meetup.title + ' | Meetups | ' + SEO.settings.title
        });
      }
    }
  });

  this.route('topics', {
    path: '/topics',
    waitOn: function() {
      return [
        subs.subscribe("suggestedTopics"),
        subs.subscribe("presentedTopics")
      ];
    },
    data: {
      groupName : Meteor.settings.public.meetup.group_name,
      suggestedTopics: Topics.find({presented: {$ne: true}}, {sort: {points: -1}}),
      presentedTopics: Topics.find({presented: true}, {sort: {points: -1}})
    },
    onBeforeAction: function() {
      if (!this.params.query.tab) {
        this.params.query.tab = 'suggested';
      }
      this.next();
    },
    onAfterAction: function() {
      SEO.set({
        title: 'Topics | ' + SEO.settings.title
      });
    }
  });

  this.route('topicDetail', {
    path: '/topics/:_id',
    waitOn: function() {
      return subs.subscribe("topic", this.params._id);
    },
    data: function() {
      return {
        groupName : Meteor.settings.public.meetup.group_name,
        topic: Topics.findOne({_id: this.params._id}),
        comments: Comments.find({parentType: 'topic', parentId: this.params._id}, {sort: { createdAt: -1 }})
      };
    },
    onAfterAction: function() {
      if(this.ready()) {
        SEO.set({
          title: this.data().topic.title + ' | Topics | ' + SEO.settings.title
        });
      }
    }
  });

  this.route('presentations', {
    path: '/presentations',
    waitOn: function() {
      return [subs.subscribe("presentations"), subs.subscribe("members")];
    },
    data: {
      groupName : Meteor.settings.public.meetup.group_name,
      topics: Presentations.find({})
    }

  });

  this.route('presentationDetail', {
    path: '/presentations/:_id',
    waitOn: function() {
      return subs.subscribe("presentation", this.params._id);
    },
    data: function() {
      return {
        groupName : Meteor.settings.public.meetup.group_name,
        presentation: Presentations.findOne({_id: this.params._id}),
        comments: Comments.find({parentType: 'presentation', parentId: this.params._id}, {sort: { createdAt: -1 }})
      };
    }
  });

  this.route('members', {
    path: '/members',
    waitOn: function() {
      return subs.subscribe("members");
    },
    data: {
      groupName : Meteor.settings.public.meetup.group_name,
      members: Meteor.users.find({}, {sort: {'profile.points': -1}})
    },
    onAfterAction: function() {
      SEO.set({
        title: 'Members | ' + SEO.settings.title
      });
    }
  });

  this.route('memberDetail', {
    path: '/members/:_id',
    waitOn: function() {
      return subs.subscribe("member", this.params._id);
    },
    data: function() {
      return {
        groupName : Meteor.settings.public.meetup.group_name,
        member: Meteor.users.findOne({_id: this.params._id})
      };
    },
    onAfterAction: function() {
      if(this.ready()) {
        SEO.set({
          title: this.data().member.profile.name + ' | Members | ' + SEO.settings.title
        });
      }
    }
  });

  // XXX Should we remove this route?
  this.route('meteorday', {
    path: '/meteorday',
    where: 'server',
    action: function() {
      this.response.writeHead(301, {Location: Meteor.settings.meetup.meteorday});
      this.response.end();
    }
  });

  this.route('coupons', {
    path: '/coupons'
  });

  this.route('couponAdded', {
    path: '/coupons/added'
  });

  this.route('couponAdd', {
    path: '/coupons/:_id',
    onRun: function () {
      Meteor.call('useCoupon', this.params._id, function (err, result) {
        if (err) {
          Session.set('coupons-error', TAPi18n.__(err.error));
          Router.go('/coupons');
        } else {
          Router.go('/coupons/added');
        }
      });
    }
  });

  // XXX Not translated
  this.route('notFound', {
    path: '*',
    where: 'server',
    action: function() {
      this.response.statusCode = 404;
      this.response.end(Handlebars.templates['404']());
    }
  });
});
