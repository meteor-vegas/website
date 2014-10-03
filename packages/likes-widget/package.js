Package.describe({
  summary: "Widget to implement like feature on an item",
  version: "1.0.0",
  name: "meteor-vegas:likes-widget"
});

Package.on_use(function (api) {
  api.versionsFrom && api.versionsFrom("METEOR@0.9.0");
  var both = ['client', 'server'];

  api.use('templating', 'client');

  api.add_files('client/likes-widget.html', 'client');
  api.add_files('client/likes-widget.js', 'client');
  
});
