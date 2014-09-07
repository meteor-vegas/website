Template._profilePhotoCircular.thumbUrl = function(userId) {
  if(this) {
    var user = Meteor.users.findOne({_id:userId});
    if(user && user.profile.thumb_link !="no_image.jpg") {
      return user.profile.thumb_link;
    } else {
      return "http://placehold.it/128x128";
    }
  } else {
    return "http://placehold.it/128x128";
  }
}
