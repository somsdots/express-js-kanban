// Modules
const Trafico = require('trafico');

const notFound = function(req, res, next){
  res.status(404);
  // respond with html page
  if (res.status) {
    res.render('_components/404', { url: req.url, layout:false });
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
};

module.exports = (options = {}) => {
  if (!options.express || !options.routes || !options.controllers) {
    throw new Error('Application can\'t be routed; express, routes and controllers must be defined.');
  }

  try {
    const traffic = new Trafico(options);
	traffic.notFound = notFound;
    return traffic.route();
  } catch (error) {
    throw new Error(`Application can't be routed; ${error.message}`);
  }
};


