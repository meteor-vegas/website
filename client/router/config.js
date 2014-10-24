Router.configure({
  layoutTemplate: 'layout',

  yieldTemplates: {
    header: {
      to: 'header',
      data: {
        groupName: function() {
          return Meteor.settings.public.meetup.group_name;
        }
      }
    },
    footer: {
      to: 'footer'
    }
  },

  onAfterAction: function() {
    $(document).scrollTop(0);
  }
});
