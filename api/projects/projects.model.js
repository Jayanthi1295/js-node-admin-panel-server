'use strict';

var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    name : {
        type : String,
        index : true
    },
    description : {
        type : String
    }, 
    status : {
        type : String
    },
    created_at: {
		type: Date,
		default: Date.now
	},
	completed_at: {
		type: Date
    },
    comment : {
        type : String
    },
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'task'
    }
});

var ProjectModel = mongoose.model('project', projectSchema);
module.exports = ProjectModel;