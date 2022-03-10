'use strict';

var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var alaramSchema = new Schema({
    id :{
       type: Number,
       default: 0
    },
    name : {
        type : String,
        index : true
    },
    type :{
        type : String
    },
    buffer : {
        type : String,
        default : "0"
    }, 
    geometry : {
        type : Object
    },
    creationTime: {
		type: Date,
		default: Date.now
	  },
	  updatedTime: {
		type: Date
    },
    deleted_at: {
		type: Date
    },
    status: {
		type: String
    },
    comment : {
        type : String
    }
});

var AlarmModel = mongoose.model('geofence', alaramSchema);


// var entitySchema = mongoose.Schema({
//   testvalue: {type: String}
// });

// entitySchema.pre('save', function(next) {
//   var doc = this;
//   GeofenceModel.findByIdAndUpdate({_id: 'entityId'}, {$inc: { id: 1} }, function(error, counter)   {
//       if(error)
//           return next(error);
//       doc.testvalue = counter.id;
//       next();
//   });
// });


module.exports = AlarmModel;