Meteor.startup(function() {
  if(Meteor.isClient) {
    SEO.config({
      title: Meteor.settings.public.meetup.group_name,
      meta: {
        'description': Meteor.settings.public.meetup.group_info
      },
      og: {
        'image': Meteor.absoluteUrl('share-image.png')
      },
      ignore: {
        meta: ['fragment', 'viewport', 'msapplication-TileColor', 'msapplication-TileImage', 'msapplication-config'],
        link: ['stylesheet', 'apple-touch-icon', 'rel', 'shortcut icon', 'icon']
      }
    });
  }
});
