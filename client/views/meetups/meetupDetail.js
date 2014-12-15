Template.meetupDetail.rendered = function() {
  window.setTimeout(function() {
    $('[data-toggle=tooltip]').tooltip();
  }, 800);
};

Template.meetupDetail.helpers({
  displayOverflowAttendees: function() {
    if (this.meetup) {
      return this.meetup.numberOfOverflowAttendees() > 0;
    }
  },

  currentUserIsAttendee: function() {
    if (this.meetup && Meteor.userId()) {
      return _(this.meetup.attendeeIds).include(Meteor.userId());
    }
  },

  groupUrl: function() {
    return 'http://www.meetup.com/' + Meteor.settings.public.meetup.group_urlname;
  }
});

Template.meetupDetail.events({

  'click [data-action=rsvp]': function(event, template) {
    event.preventDefault();

    if (!Meteor.userId()) {
      return alert(TAPi18n.__("sign_in_to_rsvp"));
    }

    // Using the new RSVP method call
    Meteor.call("doRSVP", this.meetup.meetupId , function(error, response) {
      if(error) {
        if(error.reason.code === 'not-a-member') {
          $("#not-a-member-modal").modal("show");
        }
      }
    });
  },

  'submit [data-action=add-topic]': function(event, template) {
    event.preventDefault();

    var params = {
      meetupId: this.meetup._id,
      topicId: $("[name=topicId]").val(),
      presenterId: $("[name=presenterId]").val(),
      customTitle: $("[name=customTitle]").val(),
      customDescription: $("[name=customDescription]").val()
    };

    if (!params.presenterId) {
      alert("Please choose a presenter for this topic!");
      return;
    }

    if (!params.topicId && !params.customTitle) {
      alert("Please choose a topic or enter a custom topic!");
      return;
    }

    Meteor.call('addTopicToMeetup', params, function(error) {
      if (error) {
        alert(error);
      } else {
        $("#add-topic-modal").modal("hide");
        $("[name=topicId]").val("");
        $("[name=presenterId]").val("");
        $("[name=customTitle]").val("");
        $("[name=customDescription]").val("");
      }
    });
  }
});
