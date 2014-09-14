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
  },  

  'submit': function(event, template) {
    event.preventDefault();
    Session.set("presentationURL", $("input#url").val());
    
    console.log("submitting");
    $("#url-wrapper").slideUp();
    $("#presentation-wrapper").slideDown();
    Meteor.setTimeout(function(){
       $("a#presentation-embed").oembed(null, {
          embedMethod:"fill",
          afterEmbed: function(data) {
            console.log(data);
            $("#btn-add-presentation").text("Add");
            if (Meteor.user()) {
                var presObj = {};
                if(data.title) {
                    presObj.title = data.title;
                }
                if(data.thumbnail_url) {
                    presObj.thumbnail_url = data.thumbnail_url;
                }
                presObj.oembed = data;
                var newPresentationID = Presentations.insert(presObj);
                if (newPresentationID) {
                    Router.go("presentation",{_id: newPresentationID});
                }
            }
        }
    }) 
    }, 500);
  },
  'click [data-upload-presentation]': function(event, template) {
      event.preventDefault();
      alert("This feature is not implemented yet..");
  }
  
})
