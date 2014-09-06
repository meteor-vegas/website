Template.topics.rendered = function() {
  document.title = 'Topics | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};

Template.topics.events = {

  'submit': function(event, template) {
    event.preventDefault();

    var $titleField = $("input#title");
    var $descriptionField = $("textarea#description");

    var params = {
      _id: Random.id(),
      title: $titleField.val(),
      description: $descriptionField.val()
    };

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

};
