Package.describe({
  summary: "Meetup Presentations Core Package",
  version: "1.0.1",
  name: "mtpmngr:presentations"
});

Package.on_use(function (api) {
  api.versionsFrom && api.versionsFrom("METEOR@0.9.0");
  var both = ['client', 'server'];

  api.use('iron:router', both);
  api.use('mrt:publish-with-relations','server');

  api.add_files('collections/presentations.js', both);
  api.add_files('routes/routes_presentations.js', both);

  api.add_files('client/lib/jquery-oembed-all.css', 'client');
  api.add_files('client/lib/jquery-oembed-all.js', 'client');

  api.add_files('server/publications_presentations.js', 'server');


  //Export Presentations Collection to the world
  api.export('Presentations', both);
});
