// Modules
require('attract')({ basePath: __dirname });
const express = require('express');
const log = attract('core/lib/log');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const expressLayouts = require('express-ejs-layouts');
const config = attract('config/config');
const router = attract('core/lib/router');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const api = attract('core/routes/api/v1');
const session = require('express-session');
attract('config/passport')(passport);

const [app, port] = [express(), process.env.PORT || 9000];

//Connect Db
mongoose.connect(config.database.url, { useCreateIndex: true, useNewUrlParser: true });

//Set App wide configs
app.locals.pretty = process.env.PRETTY_HTML === 'true';
app.set('views', `${__dirname}/core/views`);
app.set('view engine', 'ejs');
app.set('layout', `${__dirname}/core/views/layouts/main`);

//Set Required Middlewares
app.use(
	session({secret: config.secret,saveUninitialized: true,resave: true}),
	cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
    express.static(`${__dirname}/public`),
    expressLayouts,
    passport.initialize(),
);

//Authorization token to header
app.use(function(req, res, next) {
	if(req.session.token != null && req.session.token != undefined){
		req.headers.authorization = `JWT ${req.session.token}`;
	}
	next();
});

//Set API Routes
app.use('/api/v1', api);

//Passport JWT TOKEN AUTEHNTICATE MIDDLEWARE FOR WEB Routes
app.use(function(req, res, next) {
	passport.authenticate('jwt', { session: false }, function(err, user, info) {
	    if (err) { 
	    	return next(err); 
	    }
	    if (!user) {
	    	if(req.path !== '/auth/login' && req.path !== '/auth/register'){ 
	    		return res.redirect('/auth/login');
	    	}
	    }else if(user){
	    	if (req.path == '/auth/login' || req.path == '/auth/register') {
  				return res.redirect('/');
  			}
	    }
	    next();
  	})(req, res, next);
});

//Set WEB Routes
app.use(
	router({
		express,
		routes: `${__dirname}/core/routes`,
		controllers: `${__dirname}/core/controllers`
	})
);

//Start Express Server
app.listen(port, log.info.bind(null, ` Up on port: ${port}`));
