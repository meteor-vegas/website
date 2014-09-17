Meteor.startup(function() {
  if(Meteor.isClient) {
    SEO.config({
      title: 'Meteor Vegas',
      meta: {
        'description': 'A Bi-Monthly Meteor.js Meetup in Las Vegas, NV'
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
