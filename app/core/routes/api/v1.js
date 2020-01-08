const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../../../config/passport')(passport);
const config = require('../../../config/config');
const User = require('../../models/user');
const Board = require('../../models/board');

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
  	User.findOne({
    	username: req.body.username
  	}, function(err, user) {
  		if (err) throw err;

	    if (!user) {
	    	
	      	var newUser = new User({
      			username: req.body.username,
      			password: req.body.password
    		});

		    // save the user
		    newUser.save(function(err) {
		      if (err) {
		        return res.json({success: false, msg: 'Username already exists.'});
		      }
		      res.json({success: true, msg: 'Successful created new user.'});
		    });
	    } else {
	      res.status(401).send({success: false, msg: 'User Already Exists with same username.'});
	    }
  	});

  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 60 // 1 week
          });
          req.session.token = token;
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/signout', passport.authenticate('jwt', { session: false}), function(req, res) {
  req.logout();
  req.session.token = null;
  res.redirect('/auth/login');
});

router.post('/board', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  
  if (token) {

    var newBoard = new Board({
      title: req.body.title,
      description: req.body.description,
    });

    newBoard.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save board failed.'});
      }
      res.json({success: true, msg: 'Successful created new board.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/board/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var id = req.params.id; 

  if (token) {
    Board.findByIdAndUpdate(id,req.body,{
      new: true
    },
    function(err, model) {
      if (err) {
        return res.json({success: false, msg: 'Update board failed.'});
      } else {
        res.json({success: true, msg: 'Successful updated the board.'});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.delete('/board/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var id = req.params.id;

  if (token) {
    Board.findByIdAndRemove(id,
    function(err, model) {
      if (err) {
        return res.json({success: false, msg: 'Delete board failed.'});
      } else {
        res.json({success: true, msg: 'Successful deleted the board.'});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/board', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Board.find(function (err, boards) {
      if (err) return next(err);
      res.json(boards);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;