Template.topicDetail.rendered = function() {
  document.title = 'Topic Name Goes Here | Topics | Meteor Vegas';
  $('<meta>', { name: 'description', content: 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV' }).appendTo('head');
};
