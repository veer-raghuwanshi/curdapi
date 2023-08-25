const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     _id: {
    type: Number,
  },
    name:{
        type:String,
        required:true
    } ,
    email: {
        type:String,
        unique: true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    mobile: {
        type:String,
        unique: true,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   _id: {
//     type: Number,
//   },
//   name: String,
//   email: String,
//   password: String,
//   mobile: String,
//   city: String,
//   address: String,
//   gender: String
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

