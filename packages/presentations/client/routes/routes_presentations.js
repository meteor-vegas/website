Router.map(function() {

  this.route('presentations', {
    path: '/presentations',
    waitOn: function() {
      return this.subscribe("presentations");
    },
    data: {
      topics: Presentations.find({})
    }

  });
  this.route('presentationDetail', {
    path: '/presentations/id-goes-here'
  });

});
