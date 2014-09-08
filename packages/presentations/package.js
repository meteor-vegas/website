Package.describe({
  summary: "Meetup Presentations Core Package",
  version: "1.0.0",
  name: "mtpmngr:presentations"
});

Package.on_use(function (api) {
  api.versionsFrom && api.versionsFrom("METEOR@0.9.0");
  var both = ['client', 'server'];

  api.use('iron:router', both);

  api.add_files('collections/presentations.js', both);
  api.add_files('routes/routes_presentations.js', both);
  api.add_files('server/seeds/presentations.js', 'server');
  api.add_files('server/publications_presentations.js', 'server');


  //Export Presentations Collection to the world
  api.export('Presentations', both);
});
