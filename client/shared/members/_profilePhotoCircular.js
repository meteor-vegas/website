Template._profilePhotoCircular.thumbUrl = function(userId) {
  console.log(userId);
  if(userId) {
    var user = Meteor.users.findOne({_id:userId});
    console.log(user);
    if(user && user.profile.thumbnailUrl !="default-avatar.png") {
      return user.profile.thumbnailUrl;
    } else {
      return "http://placehold.it/128x128";
    }
  } else {
    return "http://placehold.it/128x128";
  }
}
