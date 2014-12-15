// XXX This file needs some serious cleanup.
// XXX Why do we do so many timeouts?

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

Template.presentations.helpers( {
  presentations: function(){
    return Presentations.find({});
  }
});

Template.presentations.helpers({
  presentationURL: function() {
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
    $("#btn-add-presentation").text(TAPi18n.__("next"));
    step = 1;
    loaderror = false;
    console.log("initializing modal");
  },

  'submit': function(event, template) {
    event.preventDefault();
    if (step === 1) {
      Session.set("presentationURL", $("input#url").val());

      $("#url-wrapper").slideUp();

      step = 2;
      Meteor.setTimeout(function() {
        $("a#presentation-embed").oembed(null, {
          embedMethod:"fill",
          onError: function(externalUrl,provider) {
            console.error("Error loading presentation at url: ", externalUrl, arguments);
            $("#error-wrapper").show();
            loaderror = true;
            $("#btn-add-presentation").text(TAPi18n.__('cancel'));
            return false;
          },
          onProviderNotFound: function(url) {
            console.error("Error - provider not found for ", url);
            $("#error-wrapper").show();
            loaderror = true;
            $("#btn-add-presentation").text(TAPi18n.__('cancel'));
            return false;
          },
          beforeEmbed: function(data) {
            if (loaderror) {
              $("#btn-add-presentation").text(TAPi18n.__('cancel'));
            } else {
              $("#presentation-wrapper").slideDown();
              $("#btn-add-presentation").text(TAPi18n.__('add'));
            }
          },
          afterEmbed: function(data) {
            if (Meteor.user()) {
              presObj = {
                oembed: data,
                url: $("input#url").val(),
                userId: Meteor.userId()
              };

              if (data.title) {
                presObj.title = data.title;
              }
              if (data.thumbnail_url) {
                presObj.thumbnail = data.thumbnail_url;
              }
              else if (data.thumbnail) {
                presObj.thumbnail = data.thumbnail;
              }

              var presenter = {
                _id: Meteor.userId(),
                name: Meteor.user().profile.name
              };

              presObj.presenter = presenter;
              if (!presObj.title) {
                $("#title-wrapper").show();
              }
            }
          }
        });
      }, 500);
    } else {
      if (loaderror) {
        $('#add-presentation-modal').modal('hide');
      } else {
        if (presObj.title === "" && $("#title").val() === "") {
          $("#title-wrapper").addClass("has-error");
          ShakeIt ('#title-wrapper',20,2000,8,'horz');
          setTimeout(function () { $("#title-wrapper").removeClass("has-error", 1000, "easeInBack" ); }, 3000);
          return false;
        } else {
          presObj.title = presObj.title || $("#title").val();
          $('#add-presentation-modal').modal('hide');
          var newPresentationID = Presentations.insert(presObj);
          Meteor.setTimeout(function(){
            if (newPresentationID) {
              Router.go("presentationDetail", {_id: newPresentationID});
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
