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
      return alert(TAPi18n.__("enter_comment"));
    }

    Meteor.call("createComment", params, function(error) {
      if(error) {
        return alert(error);
      }

      $bodyField.val("");
      $("#new-comment-modal").modal("hide");
    });
  }
});
