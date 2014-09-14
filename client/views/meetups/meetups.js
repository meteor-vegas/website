Template.meetups.rendered = function() {
  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template.meetups.helpers({
  displayOverflowAttendees: function() {
    if (this.numberOfOverflowAttendees) {
      return this.numberOfOverflowAttendees() > 0;
    }
  }
});
