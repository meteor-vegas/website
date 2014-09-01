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

  this.route('presentations', {
    path: '/presentations'
  });
  this.route('presentationDetail', {
    path: '/presentations/id-goes-here'
  });

  this.route('topics', {
    path: '/topics'
  });
  this.route('topicDetail', {
    path: '/topics/id-goes-here'
  });

  this.route('members', {
    path: '/members'
  });
  this.route('memberDetail', {
    path: '/members/id-goes-here'
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
