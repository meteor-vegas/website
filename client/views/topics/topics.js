Template.topics.rendered = function() {
  document.title = 'Topics | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};

Template.topics.events = {

  'submit': function(event, template) {
    event.preventDefault();

    var $titleField = $("input#title");
    var $descriptionField = $("textarea#description");

    var title = $titleField.val();
    var description = $descriptionField.val();

    Topics.insert({
      title: title,
      description: description
    });

    $titleField.val("");
    $descriptionField.val("");

    $("#new-topic-modal").modal("hide");
  }

};
