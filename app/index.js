// Modules
require('attract')({ basePath: __dirname });
const log = attract('core/lib/log');
const bodyParser = require('body-parser');
const express = require('express');

// Boilerplate
const config = attract('config/config');
const router = attract('core/lib/router');

const [app, port] = [express(), process.env.PORT || 9000];


app.locals.pretty = process.env.PRETTY_HTML === 'true';
app.set('views', `${__dirname}/core/views`);
app.set('view engine', 'ejs');
app.use(
    express.static(`${__dirname}/public`),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    router({
      express,
      routes: `${__dirname}/core/routes`,
      controllers: `${__dirname}/core/controllers`
    })
);
app.listen(port, log.info.bind(null, `🚀 Up on port: ${port}`));
