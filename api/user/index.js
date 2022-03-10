'use strict';

var express = require("express");
var router = express.Router();
var {validateUser } = require('../../auth/validation');
var auth = require('../../auth/auth.controller');
var user = require('./user.controller');
router.post('/signin', auth.login);
router.post('/register',validateUser, auth.signup);
router.get('/all', auth.allaccess);

router.get('/getdata' ,user.allgeofences );
module.exports= router;

 
