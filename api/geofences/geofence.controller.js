'use strict';
var geofenceModel = require('./geofence.model');
var async = require('async');
var _ = require('lodash');
var sendResp = require('../utils').sendResp;
var mmiconfig = require('../../config/mmi-api.config');
var axios = require('axios');
var qs = require('querystring');
var ObjectId = require('mongodb').ObjectId;
var localservermode = (process.env.DATA_SERVER == 'LOCAL' || process.env.DATA_SERVER ==undefined ) ?true : false;
exports.index = function (req, res) {
  let queryObj = {};
  console.log(">>> localservermode ",localservermode)
  if(localservermode){
    try {
      console.log(queryObj)
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      geofenceModel.find(queryObj, null, {
          limit: limit,
          skip: offset,
          sort: {
              _id: -1
          }
      }).lean().exec(function (error, geofence) {
              //console.log("result",geofence);
              if (error) {
                  return sendResp(res, 400, "Unable to Get Geofence", {
                      data: []
                  });
              } else {
                geofenceModel.count(queryObj, function (err, count) {
                      var total = err ? 'N/A' : count;
                      sendResp(res, 200, "Successfully Get Geofence!", {
                          "total": total,
                          "data": geofence
                      });
                      return;
                  });
              }
          })
      } catch (error) {
          console.log(error, ">> ERROR");
          return sendResp(res, 400, "Unable to Get Geofence", {
              data: []
          });
      }
  }else{
         // telematics 
    // mmiconfig
    console.log(">>>>>>>>  get all Geofences Function ");
    //console.log(">>> req.headers ",req.headers);
    var geofenceconfig = mmiconfig.telematics;
   // console.log(">>>> geofenceconfig ",geofenceconfig);
       var config = {
        method: geofenceconfig.Geofence.GETALL.METHOD,
        url:  geofenceconfig.Geofence.GETALL.URL,
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
  console.log(">>>>>>>>  create Geofences Function ");
  //console.log(">>> req.headers ",req.headers);
  console.log(">>>> req.body ",req.body);
  console.log(">>>> req.params ",req.params);
  console.log(">>>> req.query ",req.query);
  return sendResp(res, 500, "Unable to create Geofence", {
    data: []
  });

  if(localservermode){
        console.log(">>> inside local creation ");
        var insertObj = new geofenceModel({
          name: req.body.name,
          type: req.body.geotype,
          buffer: req.body.buffer,
          geometry: req.body.geometry
        });
        insertObj.save(function (error, geofence) {
          // asyncCallback(error, datasources)
            if(geofence){
              return sendResp(res, 200, "Geofence Created Successfully!", geofence);
            }else{
              console.log(">>>> error ",error);
              return sendResp(res, 500, "Unable to create Geofence", {
                data: []
              });
            }
        })
  
  }else{
        // mmiconfig
    var geofenceconfig = mmiconfig.telematics;
   // console.log(">>>> geofenceconfig ",geofenceconfig);
       var config = {
        method: geofenceconfig.Geofence.CREATE.METHOD,
        url:  geofenceconfig.Geofence.CREATE.URL,
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
    var geofenceId = req.params.id;
    if(localservermode){
      //return sendResp(res, 500, "Unable to Update");
      try {
        geofenceModel.findById(geofenceId, function (err, Geofence) {
            if (!Geofence) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            Geofence.name = req.body.name;
            Geofence.type = req.body.geotype;
            Geofence.buffer = req.body.buffer;
            Geofence.geometry = req.body.geometry;
            
            Geofence.save(function (err, geoRsp) {
              
                if (err) {
                    log.error("Unable to Update", err);
                    return sendResp(res, 500, "Unable to Update");
                } else {
                            return sendResp(res, 200, "Geofence Updated Successfully", {
                                Geofence: geoRsp
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
      var geofenceconfig = mmiconfig.telematics;
      let url = geofenceconfig.Geofence.UPDATE.URL.replace('{id}', geofenceId);
      // console.log(">>>> geofenceconfig ",geofenceconfig);
          var config = {
           method: geofenceconfig.Geofence.UPDATE.METHOD,
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
  var geofenceId = req.params.id;
    if(localservermode){
      //return sendResp(res, 500, "Unable to delete");
      try {
        geofenceModel.findOneAndRemove(geofenceId, function (err, Geofence) {
            if (!Geofence) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            else {
                return sendResp(res, 200, "Geofence Deleted Successfully", {
                  Geofence: Geofence
                });
          }
        });
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Delete");
    }
    }else{

      var geofenceconfig = mmiconfig.telematics;
      let url = geofenceconfig.Geofence.DELETE.URL.replace('{id}', geofenceId);
      // console.log(">>>> geofenceconfig ",geofenceconfig);
          var config = {
           method: geofenceconfig.Geofence.DELETE.METHOD,
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
  console.log(">>>> get all activities ");
  console.log(">>>> req.query ",req.query);
  let queryObj = {};
  console.log(">>> localservermode ",localservermode)
  if(localservermode){
    try {
      console.log(queryObj)
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;

                  var sampleData = [
                    {
                      "entryLongitude": 77.2160,
                      "entryLatitude": 28.5989,
                      "exitLongitude": 38.8765,
                      "exitLatitude": 46.8765,
                      "entryTimestamp": 1580105880,
                      "exitTimestamp": 1580105880,
                      "geofenceName": "Polygon  new",
                      "geofenceId": ObjectId("621617a6f0679c66ff0d307c"),
                      "deviceId": 87676,
                      "deviceName": "Sample Device 1",
                      "id":1
                    },
                    {
                      "entryLongitude": 77.0965,
                      "entryLatitude": 28.4843,
                      "exitLongitude": 38.8765,
                      "exitLatitude": 46.8765,
                      "entryTimestamp": 1580105880,
                      "exitTimestamp": 1580105880,
                      "geofenceName": "Circle-Test 1",
                      "geofenceId": ObjectId("62232ce8de92a4469aaa79ac"),
                      "deviceId": 87677,
                      "deviceName": "Sample Device 2",
                      "id":2
                    },
                    {
                      "entryLongitude": 77.2160,
                      "entryLatitude": 28.5989,
                      "exitLongitude": 38.8765,
                      "exitLatitude": 46.8765,
                      "entryTimestamp": 1580105880,
                      "exitTimestamp": 1580105880,
                      "geofenceName": "gggggg",
                      "geofenceId": ObjectId("6214dfc372919f3446a5ad2b"),
                      "deviceId": 87678,
                      "deviceName": "Sample Device 3",
                      "id":3
                    }
                  ];
                sendResp(res, 200, "Successfully Get Geofence device data!", {
                          "total": sampleData.length,
                          "data": sampleData
                      });
                    return;
      // geofenceModel.find(queryObj, null, {
      //     limit: limit,
      //     skip: offset,
      //     sort: {
      //         _id: -1
      //     }
      // }).lean().exec(function (error, geofence) {
      //         if (error) {
      //             return sendResp(res, 400, "Unable to Get Geofence", {
      //                 data: []
      //             });
      //         } else {
      //           geofenceModel.count(queryObj, function (err, count) {
      //                 var total = err ? 'N/A' : count;
      //                 sendResp(res, 200, "Successfully Get Geofence!", {
      //                     "total": total,
      //                     "data": geofence
      //                 });
      //                 return;
      //             });
      //         }
      //     })
      } catch (error) {
          console.log(error, ">> ERROR");
          return sendResp(res, 400, "Unable to Get Geofence", {
              data: []
          });
      }
  }else{
         // telematics 
    // mmiconfig
    console.log(">>>>>>>>  get all Geofences Function ");
    //console.log(">>> req.headers ",req.headers);
    var geofenceconfig = mmiconfig.telematics;
   // console.log(">>>> geofenceconfig ",geofenceconfig);
       var config = {
        method: geofenceconfig.Geofence.GETALLACTIVITY.METHOD,
        url:  geofenceconfig.Geofence.GETALLACTIVITY.URL,
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
