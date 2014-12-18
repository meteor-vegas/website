Template.home.helpers({
  // XXX This helper rely on the fact that we publish and subscribe to all users
  // in any case, including here on the home page (even if we don't need to).
  // This behavior should probably be improved using a dedicated pub/sub for the
  // users counter.
  count_members: function() {
    return Meteor.users.find().count();
  },

  // We extract the city name from the group name, assuming that the group name
  // is the word "Meteor" + a city name.
  group: function() {
    var meetupSettings = Meteor.settings.public.meetup;
    var groupName = meetupSettings.group_name;
    var groupInfos = meetupSettings.group_info;
    var groupCity = groupName.replace(/\s*Meteor\s*/i, '');
    return {
      name: groupName,
      city: groupCity,
      info: groupInfos
    }
  }
});
