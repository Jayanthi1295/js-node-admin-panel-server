'use strict';
var projectModel = require('./projects.model');
var async = require('async');
var _ = require('lodash');
var sendResp = require('../utils').sendResp;
exports.index = function (req, res) {
    let queryObj = {};

    try {
      
        if (req.query.projectname) {
            var queryValue = req.query.projectname;
            queryObj.name = new RegExp(queryValue, "i");
        }
       
        if (req.query.description) {
            var queryValue = req.query.description;
            queryObj.description = new RegExp(queryValue, "i");
        }
        if (req.query.comment) {
            var queryValue = req.query.comment;
            queryObj.comment = new RegExp(queryValue, "i");
        }
        if (req.query.status) {
            var queryValue = req.query.status;
            queryObj.status = new RegExp(queryValue, "i");
        }
       
        if (req.query.created_at) {
            var dateFilter = new Date(req.query.created_at);
            // var dateFilter = req.query.created_at;
            var nextDateFilter = new Date(req.query.created_at);
            nextDateFilter.setDate(dateFilter.getDate() + 1);
            console.log(dateFilter.toISOString(), "ndateFilter.toISOString()");
            console.log(nextDateFilter.toISOString(), "nextDateFilter.toISOString()")
            queryObj.created_at = {
                '$gte': dateFilter.toISOString(),
                '$lte': nextDateFilter.toISOString()
            }
        }
        if (req.query.last_updated_at) {
            var lastdateFilter = new Date(req.query.last_updated_at);
            var lastnextDateFilter = new Date(req.query.last_updated_at);
            lastnextDateFilter.setDate(lastdateFilter.getDate() + 1);
            console.log(req.query.last_updated_at, "req.query.last_run_at")
            console.log(lastdateFilter.toISOString(), "ndateFilter.toISOString()");
            console.log(lastnextDateFilter.toISOString(), "nextDateFilter.toISOString()")
            queryObj.last_updated_at = {
                '$gte': lastdateFilter.toISOString(),
                '$lte': lastnextDateFilter.toISOString()
            }
        }
    } catch (error) {
        console.log(error, ">>> ERROR");
        return sendResp(res, 400, "Unable to Get Project", {
            Project: []
        });
    }
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;

    try {
        console.log(queryObj)
        projectModel.find(queryObj, null, {
            limit: limit,
            skip: offset,
            sort: {
                _id: -1
            }
        }).lean().exec(function (error, Project) {
            console.log(Project);
            if (error) {
                return sendResp(res, 400, "Unable to Get Project", {
                    Project: []
                });
            } else {
                projectModel.count(queryObj, function (err, count) {
                    var total = err ? 'N/A' : count;
                    sendResp(res, 200, "Successfully Get Project!", {
                        "total": total,
                        "Project": Project
                    });
                    return;
                });
            }
        })
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 400, "Unable to Get Project", {
            Project: []
        });
    }
}

exports.create = function (req, res) {
    var functionArray = [];
    // console.log(req.user, 'create >>>>>>>>>>>>>> ', req.body)
    function nameValidation(asyncCallback) {
        let query = {
            name: req.body.name,
            description: req.body.description,
            status: req.user.status,
            completed_at: req.body.completed_date ? req.body.completed_date : null
        };
        console.log("nameValidation >>>>>> ", query)
        projectModel.find(query).lean().exec(function (error, response) {
            console.log(response, ">>>> nameValidation RESPONSE");
            if (response && response.length) {
                asyncCallback({ code: 409 })
            } else {
                asyncCallback(null)
            }
        })
    }



    function createProject(asyncCallback) {
        console.log("req.body.defaultProject >>>>>", req.body.defaultProject)
        var insertObj = new projectModel({
            name: req.body.name,
            description: req.body.description,
            status: req.user.status,
            completed_at: req.body.completed_date ? req.body.completed_date : null
        });
        insertObj.save(function (error, datasources) {
            asyncCallback(error, datasources)
        })

    }

    functionArray.push(nameValidation);
    functionArray.push(createProject);
  
    try {
        async.waterfall(functionArray, function (error, result) {
            if (error) {
                if (error.code === 409) {
                    res.statusCode = 409;
                    return sendResp(res, 409, "Project Name Already Exist!");
                }
              
                return sendResp(res, 500, "Unable to Create Project");
            } else {
                return sendResp(res, 200, "Project Created Successfully!", result);
            }
        })
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Create Project");
    }
}
exports.update = function (req, res) {
   
    try {
        projectModel.findById(ProjectId, function (err, Project) {
            if (!Project) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            Project.name = req.body.name;
            Project.description =req.body.description;
            Project.created_at =req.body.created_at;
            Project.completed_at =req.body.completed_at;
            Project.status = req.body.status;
            Project.save(function (err, ProjectRsp) {
              
                if (err) {
                    log.error("Unable to Update", err);
                    return sendResp(res, 500, "Unable to Update");
                } else {
                            return sendResp(res, 200, "Updated Successfully", {
                                Project: ProjectRsp
                            });
                }
            });
        });
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Update");
    }

};

exports.delete = function (req, res) {
   
    try {
        projectModel.findOneAndRemove(ProjectId, function (err, Project) {
            if (!Project) {
                //  log.error('404', "Not Found");
                return sendResp(res, 404, "Not Found");
            }
            else {
                return sendResp(res, 200, "Deleted Successfully", {
                    Project: ProjectRsp
                });
          }
        });
    } catch (error) {
        console.log(error, ">> ERROR");
        return sendResp(res, 500, "Unable to Delete");
    }

};
