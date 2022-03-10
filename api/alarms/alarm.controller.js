'use strict';
var alarmModel = require('./alarm.model');
var async = require('async');
var _ = require('lodash');
var sendResp = require('../utils').sendResp;
var mmiconfig = require('../../config/mmi-api.config');
var axios = require('axios');
var qs = require('querystring');
var localservermode = (process.env.DATA_SERVER == 'LOCAL' || process.env.DATA_SERVER ==undefined ) ?true : false;
exports.index = function (req, res) {
  let queryObj = {};
  console.log(">>> localservermode ",localservermode)
  if(localservermode){
    try {
      console.log(queryObj)
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      alarmModel.find(queryObj, null, {
          limit: limit,
          skip: offset,
          sort: {
              _id: -1
          }
      }).lean().exec(function (error, Alarm) {
              //console.log("result",Alarm);
              if (error) {
                  return sendResp(res, 400, "Unable to Get Alarm", {
                      data: []
                  });
              } else {
                alarmModel.count(queryObj, function (err, count) {
                      var total = err ? 'N/A' : count;
                      sendResp(res, 200, "Successfully Get Alarm!", {
                          "total": total,
                          "data": Alarm
                      });
                      return;
                  });
              }
          })
      } catch (error) {
          console.log(error, ">> ERROR");
          return sendResp(res, 400, "Unable to Get Alarm", {
              data: []
          });
      }
  }else{
         // telematics 
    // mmiconfig
    console.log(">>>>>>>>  get all Alarms Function ");
    //console.log(">>> req.headers ",req.headers);
    var Alarmconfig = mmiconfig.telematics;
   // console.log(">>>> Alarmconfig ",Alarmconfig);
       var config = {
        method: Alarmconfig.Alarm.GETALL.METHOD,
        url:  Alarmconfig.Alarm.GETALL.URL,
        headers: {
          'accept': 'application/json',
          'Authorization': req.headers.authorization
        }
      };
    //   console.log(">>> cnfig ",config);
      axios(config)
      .then(function (response) {
       // console.log("response ",JSON.stringify(response.data));
        res.status(200).send({data : JSON.stringify(response.data) });
      })
      .catch(function (error) {
        console.log("error",error);
        res.status(400).send({error: error});
      });

      
  }

  

}

exports.create = function (req, res) {
  console.log(">>>>>>>>  create Alarms Function ");
  //console.log(">>> req.headers ",req.headers);
  console.log(">>>> req.body ",req.body);
  console.log(">>>> req.params ",req.params);
  console.log(">>>> req.query ",req.query);
  return sendResp(res, 500, "Unable to create Alarm", {
    data: []
  });

  if(localservermode){
        console.log(">>> inside local creation ");
        var insertObj = new alarmModel({
          name: req.body.name,
          type: req.body.geotype,
          buffer: req.body.buffer,
          geometry: req.body.geometry
        });
        insertObj.save(function (error, Alarm) {
          // asyncCallback(error, datasources)
            if(Alarm){
              return sendResp(res, 200, "Alarm Created Successfully!", Alarm);
            }else{
              console.log(">>>> error ",error);
              return sendResp(res, 500, "Unable to create Alarm", {
                data: []
              });
            }
        })
  
  }else{
        // mmiconfig
    var Alarmconfig = mmiconfig.telematics;
   // console.log(">>>> Alarmconfig ",Alarmconfig);
       var config = {
        method: Alarmconfig.Alarm.CREATE.METHOD,
        url:  Alarmconfig.Alarm.CREATE.URL,
        data: qs.stringify(req.body),
        headers: {
          'accept': 'application/json',
          'Authorization': req.headers.authorization
        }
      };
    //   console.log(">>> cnfig ",config);
      axios(config)
      .then(function (response) {
       // console.log("response ",JSON.stringify(response.data));
        res.status(200).send({data : JSON.stringify(response.data) });
      })
      .catch(function (error) {
        console.log("error",error);
        res.status(400).send({error: error});
      });
    }
}
exports.update = function (req, res) {
    console.log(">>> entered update function ");
    console.log(">>>> req.params ",req.params);
    var AlarmId = req.params.id;
    if(localservermode){
      //return sendResp(res, 500, "Unable to Update");
      try {
        alarmModel.findById(AlarmId, function (err, Alarm) {
            if (!Alarm) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            Alarm.name = req.body.name;
            Alarm.type = req.body.geotype;
            Alarm.buffer = req.body.buffer;
            Alarm.geometry = req.body.geometry;
            
            Alarm.save(function (err, geoRsp) {
              
                if (err) {
                    log.error("Unable to Update", err);
                    return sendResp(res, 500, "Unable to Update");
                } else {
                            return sendResp(res, 200, "Alarm Updated Successfully", {
                                Alarm: geoRsp
                      });
                }
            });
        });
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Update");
    }
    }else{
      // mmi config
      var Alarmconfig = mmiconfig.telematics;
      let url = Alarmconfig.Alarm.UPDATE.URL.replace('{id}', AlarmId);
      // console.log(">>>> Alarmconfig ",Alarmconfig);
          var config = {
           method: Alarmconfig.Alarm.UPDATE.METHOD,
           url: url,
           data: qs.stringify(req.body),
           headers: {
             'accept': 'application/json',
             'Authorization': req.headers.authorization
           }
         };
         console.log(">>> update cnfig ",config);
         axios(config)
         .then(function (response) {
          // console.log("response ",JSON.stringify(response.data));
           res.status(200).send({data : JSON.stringify(response.data) });
         })
         .catch(function (error) {
           console.log("error",error);
           res.status(400).send({error: error});
         });
    }
};

exports.delete = function (req, res) {
   console.log(">>>> entered delete function ", req.params.id);
  var AlarmId = req.params.id;
    if(localservermode){
      //return sendResp(res, 500, "Unable to delete");
      try {
        alarmModel.findOneAndRemove(AlarmId, function (err, Alarm) {
            if (!Alarm) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            else {
                return sendResp(res, 200, "Alarm Deleted Successfully", {
                  Alarm: Alarm
                });
          }
        });
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Delete");
    }
    }else{

      var Alarmconfig = mmiconfig.telematics;
      let url = Alarmconfig.Alarm.DELETE.URL.replace('{id}', AlarmId);
      // console.log(">>>> Alarmconfig ",Alarmconfig);
          var config = {
           method: Alarmconfig.Alarm.DELETE.METHOD,
           url: url,
          // data: qs.stringify(req.body),
           headers: {
             'accept': 'application/json',
             'Authorization': req.headers.authorization
           }
         };
       //   console.log(">>> cnfig ",config);
         axios(config)
         .then(function (response) {
          // console.log("response ",JSON.stringify(response.data));
           res.status(200).send({data : JSON.stringify(response.data) });
         })
         .catch(function (error) {
           console.log("error",error);
           res.status(400).send({error: error});
         });
    }
};

exports.getAllActivities = function (req, res) {
  let queryObj = {};
  console.log(">>> localservermode ",localservermode)
  if(localservermode){
    try {
      console.log(queryObj)
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      alarmModel.find(queryObj, null, {
          limit: limit,
          skip: offset,
          sort: {
              _id: -1
          }
      }).lean().exec(function (error, Alarm) {
              //console.log("result",Alarm);
              if (error) {
                  return sendResp(res, 400, "Unable to Get Alarm", {
                      data: []
                  });
              } else {
                alarmModel.count(queryObj, function (err, count) {
                      var total = err ? 'N/A' : count;
                      sendResp(res, 200, "Successfully Get Alarm!", {
                          "total": total,
                          "data": Alarm
                      });
                      return;
                  });
              }
          })
      } catch (error) {
          console.log(error, ">> ERROR");
          return sendResp(res, 400, "Unable to Get Alarm", {
              data: []
          });
      }
  }else{
         // telematics 
    // mmiconfig
    console.log(">>>>>>>>  get all Alarms Function ");
    //console.log(">>> req.headers ",req.headers);
    var Alarmconfig = mmiconfig.telematics;
   // console.log(">>>> Alarmconfig ",Alarmconfig);
       var config = {
        method: Alarmconfig.Alarm.GETALLACTIVITY.METHOD,
        url:  Alarmconfig.Alarm.GETALLACTIVITY.URL,
        headers: {
          'accept': 'application/json',
          'Authorization': req.headers.authorization
        }
      };
    //   console.log(">>> cnfig ",config);
      axios(config)
      .then(function (response) {
       // console.log("response ",JSON.stringify(response.data));
        res.status(200).send({data : JSON.stringify(response.data) });
      })
      .catch(function (error) {
        console.log("error",error);
        res.status(400).send({error: error});
      });

      
  }
}
