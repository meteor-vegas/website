Template.topics.rendered = function() {
};

Template.topics.helpers({
  'activeTabClass': function(tab) {
    if (tab === Router.current().params.tab) {
      return 'active';
    }
  }
});

Template.topics.events({

  'submit': function(event, template) {
    event.preventDefault();

    var $titleField = $("input#title");
    var $descriptionField = $("textarea#description");

    var params = {
      _id: Random.id(),
      title: $titleField.val(),
      description: $descriptionField.val()
    };

    if (params.title === "") {
      alert("Please enter a topic title!");
      return false;
    }

    Meteor.call("createTopic", params, function(error) {
      if(error) {
        alert(error);
        return false;
      }

      $titleField.val("");
      $descriptionField.val("");

      $("#new-topic-modal").modal("hide");

      window.setTimeout(function() {
        Router.go('topicDetail', {_id: params._id});
      }, 500);
    });

  }

});
