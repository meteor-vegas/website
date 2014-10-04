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

Template.meetups.events({
  "click [data-action=fetchMeetups]": function(event, template) {
    event.preventDefault();

    Meteor.call("fetchEvents", "upcoming", function(error) {
      if (error) {
        alert(error);
      } else {
        alert("Done!");
      }
    });
  }
});
