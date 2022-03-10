'use strict';
var async = require('async');
var _ = require('lodash');
var sendResp = require('../utils').sendResp;

var jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs')
var axios = require('axios');


exports.allgeofences = function(req,res){
    console.log(">>>>>>>>  Inside Geofences Function ");
    console.log(">>> req.headers ",req.headers);
    var config = {
        method: 'get',
        url: 'https://intouch.mapmyindia.com/iot/api/geofences',
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer 1eecc247-1ca9-465b-964d-0f417fb3f6ee'  /* put your token here without <>*/
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log("response ",JSON.stringify(response.data));
        res.status(200).send({data : JSON.stringify(response.data) });
      })
      .catch(function (error) {
        console.log("error",error);
        res.status(400).send({error: error});
      });
   
   }
