'use strict';
var async = require('async');
var _ = require('lodash');
var sendResp = require('../api/utils').sendResp;

var User = require('../api/user/user.model');
var jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs')
var mmiauth= require('../config/mmi-api.config');
var axios = require('axios');
var qs = require('querystring');
exports.signup = function(req,res){
     console.log(">>> signup ", req.body);
    let query = {email: req.body.email};
     User.findOne(query).lean().exec(function (error, userData) {
         console.log(">>> existing userData ",userData);
        if(userData!=null){
            res.status(400).json({"error":'Email already Exist'})
          }else{
            var user =  new User({
                username: req.body.username,
                email: req.body.email,
                password: bycrypt.hashSync(req.body.password, 10)
              })
              console.log(">>> user ",user);
              try{
                  user.save(function (err, user) {
                      console.log(">>> saved user ",user);
                            const payload = {
                                  user: {
                                  id: user._id
                                  }
                              };
                              let secretKey = process.env.SECRET_KEY || "teststring";
                              jwt.sign(payload,secretKey,{expiresIn: 10000},function(err, token){
                                  if(err){
                                  res.send(err)
                                  }
                                  res.status(200).json({
                                  token,
                                  user
                                  })
                         })
             
                })
              }
              catch(err){
                res.status(400).json({'error':err}) 
              }
          }
     })

  }


exports.login = function(req,res){   
   console.log(">>>> login ",req.body);
     let query = {username: req.body.username};
     User.findOne(query)
     .lean()
    // .populate("roles", "-__v")
     .exec(function (error, user) {
        console.log(">>> email exist ",user);
        console.log(">>> email error ",error);
        if(user==null){
            return res.status(400).json({error:"User Name not Found"})
          }else{
           // const checkpassword =  bycrypt.compare(req.body.password,   emailExist.password)
           const checkpassword =  bycrypt.compareSync(req.body.password,   user.password)
            if(!checkpassword){
             return res.status(400).json({error:"Password mismatch"})
            }
            let secretKey = process.env.SECRET_KEY || "teststring";
            let expiry = process.env.TOKEN_EXPIRY || '86400'; // 24 hrs
            const token = jwt.sign({id: user._id},secretKey,{expiresIn : expiry})
            //res.header('auth-token',token).json({'Token':token,'status':200})
            var authorities = [];

            // for (let i = 0; i < user.roles.length; i++) {
            //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            // }
            console.log(">>> authorities ",authorities);
            return res.status(200).send({
              id: user._id,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token
            });
          }
     })
 
  }

 exports.allaccess = function(req,res){
  res.status(200).send("Public Content.");
 }


 exports.mmitokenGeneration = function(req,res){
   console.log(">>> MMI AUth Token generation >>>> ");
 // console.log(">>>> MMI token generation ",req.body);
  // console.log(">>> mmiauth ", mmiauth.tokenGeneration)
  var tokengeneration =  mmiauth.tokenGeneration;
  var reqbody = {
      grant_type : process.env.MMI_GRANT_TYPE || 'client_credentials',
      client_id : process.env.MMI_CLIENT_ID || '33OkryzDZsJzBfpUNoVGjYBePiv_s5dNUDZimuWCr9PHopKU5DVKdTxnWwoFhFurpTcQ3XE7GQmlZp77xZQNcg==',
      client_secret : process.env.MMI_CLIENT_SECRET ||'lrFxI-iSEg8wMQ_k6JHxMDsRoWmnV619rF3gxU3CQUeGgeEmoQZN5es4a_DXo_qk-P7BTrJhXsr1bnzVeiWQnaSuAzUMPoPo'
   }
  var config = {
    method: tokengeneration.METHOD,
    url: tokengeneration.URL,
    data: qs.stringify(reqbody),
    headers: { 
      contentType: 'application/x-www-form-urlencoded',
      accept: 'application/json'
    }
  };
  //console.log(">>> test config ",config);
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
