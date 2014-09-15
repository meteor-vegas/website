Template._profilePhotoCircular.thumbUrl = function(userId) {
  if(userId) {
    var user = Meteor.users.findOne({_id:userId});
    if(user && user.profile.thumbnailUrl !="default-avatar.png") {
      return user.profile.thumbnailUrl;
    } else {
      return "/default-avatar.png";
    }
  } else {
    return "/default-avatar.png";
  }
}
