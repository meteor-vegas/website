Template.memberDetail.rendered = function() {
};

Template.memberDetail.events({
  'click [data-remove]': function(event, template) {
    var userId = Meteor.userId();
    var activity = this;

    event.preventDefault();
    if(Roles.userIsInRole(userId, ['admin'])) {
      if (confirm(TAPi18n.__('confirm_remove_activity'))) {
        Activities.remove(this._id);
      }
    }
  }
});
