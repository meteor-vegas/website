Template.memberDetail.rendered = function() {};

Template.memberDetail.events({
  'click .add-points-toggle': function(evt, template) {
    evt.preventDefault();
    $('.add-points-container').toggleClass('hide');
  },
  'click .add-points-handler': function(evt, template) {
    evt.preventDefault();

    var amount = parseInt($('.add-points-amount').val(), 10),
      reason = $('.add-points-reason').val();

    Meteor.call('custom', {
      "userId": Router.current().params._id,
      "reason": reason,
      "points": amount,
    });

    Meteor.users.update(Router.current().params._id, {
      $inc: {
        "profile.points": amount
      }
    });

    $('.add-points-amount').val('');
    $('.add-points-reason').val('');
    $('.add-points-container').toggleClass('hide');
  }
});