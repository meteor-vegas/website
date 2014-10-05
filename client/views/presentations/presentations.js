//Global
var presObj = {};
var step = 1;

Template.presentations.rendered = function() {
};

Template.presentations.presentations = function() {
  return Presentations.find({});
}

Template.presentations.presentationURL = function() {
    return Session.get("presentationURL");
}

Template.presentations.events({

  'show.bs.modal': function() {
    $("#url-wrapper").show();
    $("#presentation-wrapper").hide();
    $("input#url").val("");
    $("#btn-add-presentation").text("Next");
    step = 1;
  },

  'submit': function(event, template) {
    event.preventDefault();
    if(step===1) {
        Session.set("presentationURL", $("input#url").val());

        $("#url-wrapper").slideUp();
        $("#presentation-wrapper").slideDown();
        step=2;
        Meteor.setTimeout(function(){
           $("a#presentation-embed").oembed(null, {
              embedMethod:"fill",
              afterEmbed: function(data) {
                $("#btn-add-presentation").text("Add");
                if (Meteor.user()) {
                    presObj={};
                    if(data.title) {
                        presObj.title = data.title;
                    }
                    if(data.thumbnail_url) {
                        presObj.thumbnail = data.thumbnail_url;
                    }
                    if(data.thumbnail) {
                        presObj.thumbnail = data.thumbnail;
                    }
                    presObj.oembed = data;
                    presObj.url = $("input#url").val();
                    presObj.userId = Meteor.userId();
                    var presenter = {};
                    presenter._id = Meteor.userId();
                    presenter.name = Meteor.user().profile.name;
                    presObj.presenter = presenter;
                }
            }
        })
        }, 500);
    } else {
        $('#add-presentation-modal').modal('hide');
        var newPresentationID = Presentations.insert(presObj);
        Meteor.setTimeout(function(){
          if (newPresentationID) {
              Router.go("presentationDetail",{_id: newPresentationID});
          }
        }, 500)

    }
  },
  'click [data-upload-presentation]': function(event, template) {
      event.preventDefault();
      alert("This feature is not implemented yet..");
  }

})
