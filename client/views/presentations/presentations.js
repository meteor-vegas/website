//Global
var presObj = {};
var step = 1;
var loaderror = false;

/////////////////
/*
 * Shake It plugin - http://www.soslignes-ecrivain-public.fr/
 * v1.0
 * October 1st, 2012
 * Use and abuse!
*/
function ShakeIt (obj,margin,time,cycles,dir) {
  speed = time / ((2 * cycles) + 1);
  margRat = 1 + (60/(cycles*cycles)); $(obj).stop(1,1);
	for (i = 0; i <= cycles; i++) {
		for (j = -1; j <= 1; j+=2)
		if (dir == 'vert') {$(obj).animate({marginTop: (i!=cycles)*j*margin}, {duration:speed, queue:true});}
		else {$(obj).animate({marginLeft: (i!=cycles)*j*margin}, {duration:speed, queue:true});}
		margin/=margRat;
	}
}

////////////////////

Template.presentations.rendered = function() {
};

Template.presentations.helpers({
  presentations: function () {
    return Presentations.find({});
  },
  presentationURL: function () {
    return Session.get("presentationURL");
  }
});

Template.presentations.events({

  'show.bs.modal': function() {
    $("#url-wrapper").show();
    $("#presentation-wrapper").hide();
    $("#title-wrapper").hide();
    $("#error-wrapper").hide();
    $("input#url").val("");
    $("#title").val("");
    $("#btn-add-presentation").text("Next");
    step = 1;
    loaderror = false;
    console.log("initializing modal");
  },

  'submit': function(event, template) {
    event.preventDefault();
    if(step===1) {
        Session.set("presentationURL", $("input#url").val());

        $("#url-wrapper").slideUp();

        step=2;
        Meteor.setTimeout(function(){
           $("a#presentation-embed").oembed(null, {
              embedMethod:"fill",
              onError: function(externalUrl,provider) {
                console.log("Error loading presentation at url: ", externalUrl);
                $("#error-wrapper").show();
                loaderror = true;
                $("#btn-add-presentation").text("Cancel");
                return false;
              },
              onProviderNotFound: function(url) {
                console.log("Error - provider not found for ", url);
                $("#error-wrapper").show();
                loaderror = true;
                $("#btn-add-presentation").text("Cancel");
                return false;
              },
              beforeEmbed: function(data) {
                if(loaderror) {
                  $("#btn-add-presentation").text("Cancel");
                } else {
                  $("#presentation-wrapper").slideDown();
                  $("#btn-add-presentation").text("Add");
                }
              },
              afterEmbed: function(data) {
                console.log("data", data);
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
                      if(!presObj.title) {
                        $("#title-wrapper").show();
                      }
                  }
            }
        });
        }, 500);
    } else {
        console.log ("presObj ", presObj);
        if(loaderror) {
          $('#add-presentation-modal').modal('hide');
        } else {
          if($("#title").val() === "") {
            $("#title-wrapper").addClass("has-error");
            ShakeIt ('#title-wrapper',20,2000,8,'horz');
            setTimeout(function() {$("#title-wrapper").removeClass("has-error", 1000, "easeInBack" );}, 3000);
            return false;
          } else {
            presObj.title = $("#title").val();
            $('#add-presentation-modal').modal('hide');
            var newPresentationID = Presentations.insert(presObj);
            Meteor.setTimeout(function(){
              if (newPresentationID) {
                  console.log ( "Routing to ", newPresentationID);
                  Router.go("presentationDetail",{_id: newPresentationID});
              }
            }, 500);
          }
        }
    }
  },
  'click [data-upload-presentation]': function(event, template) {
      event.preventDefault();
      alert("This feature is not implemented yet..");
  }

});
