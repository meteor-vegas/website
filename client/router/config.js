Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',

  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },

  onBeforeAction: function() {
    $('meta[name^="description"]').remove();
  },

  onAfterAction: function() {
    $(document).scrollTop(0);
  }
});
