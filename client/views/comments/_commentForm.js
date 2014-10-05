Template._commentForm.events({
  'submit': function(event, template) {
    event.preventDefault();

    var $bodyField = $("textarea#body");

    var params = {
      body: $bodyField.val(),
      parentType: this.parentType,
      parentId: this.parentId,
      parentTitle: this.parentTitle
    };

    if (params.body === "") {
      alert("Please enter a comment!");
      return false;
    }

    Meteor.call("createComment", params, function(error) {
      if(error) {
        alert(error);
        return false;
      }

      $bodyField.val("");
      $("#new-comment-modal").modal("hide");
    });
  }
});
