Router.map(function() {

  this.route('presentations', {
    path: '/presentations',
    waitOn: function() {
      return [this.subscribe("presentations"), this.subscribe("members")];
    },
    data: {
      topics: Presentations.find({})
    }

  });
  this.route('presentationDetail', {
    path: '/presentations/:_id',
    waitOn: function() {
      console.log(this.params._id);
      return [this.subscribe("presentation", this.params._id), this.subscribe("members"), this.subscribe("comments")];
    },
    data: function() {
      return {
        presentation: Presentations.findOne({_id: this.params._id}),
        comments: Comments.find({parentType: 'presentation', parentId: this.params._id}, {sort: { createdAt: -1 }})
      };
    }
  });

});
