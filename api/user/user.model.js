'use strict';

var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var async = require('async');

var userSchema = new Schema({
    name: {
        type: String
      },
    username:{
      type: String,
      required: true,
      max: 200,
    },
    email: {
        type: String,
        required: true,
        unique: true,
      },
    password: {
        type: String,
        required: true
      },
    status : {
        type : String
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    created_at: {
		type: Date,
		default: Date.now
	}
   }
     ,{timestamps: true}   
);


// userSchema.pre('save', async function(next) {
//     const user = this
// // It will check if the password is being modified or not.
//     if(user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     next()
// }
// )
var UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;