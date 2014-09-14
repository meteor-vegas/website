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
    console.log("modal loaded");
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
        
        console.log("submitting");
        $("#url-wrapper").slideUp();
        $("#presentation-wrapper").slideDown();
        step=2;
        Meteor.setTimeout(function(){
           $("a#presentation-embed").oembed(null, {
              embedMethod:"fill",
              afterEmbed: function(data) {
                console.log(data);
                $("#btn-add-presentation").text("Add");
                if (Meteor.user()) {
                    presObj={};
                    if(data.title) {
                        presObj.title = data.title;
                    }
                    if(data.thumbnail_url) {
                        presObj.thumbnail_url = data.thumbnail_url;
                    }
                    presObj.oembed = data;
                }
            }
        }) 
        }, 500);
    } else {
        var newPresentationID = Presentations.insert(presObj);
        if (newPresentationID) {
            Router.go("presentations",{_id: newPresentationID});
        }
    }
  },
  'click [data-upload-presentation]': function(event, template) {
      event.preventDefault();
      alert("This feature is not implemented yet..");
  }
  
})
