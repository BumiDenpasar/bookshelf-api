const Hapi = require('@hapi/hapi');

const init = async () => {
  const routes = require('./routes');
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};


init();