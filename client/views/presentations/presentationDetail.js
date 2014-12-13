Template.presentationDetail.rendered = function() {
  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template.presentationDetail.events({
  'click [data-action=removePresentation]': function (event, template) {
    Presentations.remove({_id: template.data.presentation._id});
    Router.go('/presentations');
  }
});
