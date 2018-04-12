var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/testt');
mongoose.Promise = global.Promise;

var UsersSchema = mongoose.Schema({
  name : {type : String},
  id : {type : String, unique : true},
  passwd : {type : String}
});


Users = mongoose.model("users", UsersSchema);

exports.Users = Users;