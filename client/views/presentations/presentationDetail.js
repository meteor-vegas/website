Template.presentationDetail.rendered = function() {
  document.title = 'Presentation Name Goes Here | Presentations | Meteor Vegas'
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');

  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};
