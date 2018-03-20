var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
 
//註冊資料
var signupdata = new Schema({
	Username: String,
	StudentID: String,
	Email: String,
	Password: String,	
	Verifykey: String,
	TransactionKey: String,
	//Isverified: Boolean,
	CreateDate: Date
});

//登入資料
var Logindata = new Schema({
	Companyname: String,
	Email: String,
	Username: String,
	Password: String,	
	CreateDate: Date
});

mongoose.model( 'Signupdata', signupdata );
mongoose.model( 'Logindata', Logindata );
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://kappa:nccucs103703051@ds227168.mlab.com:27168/nccuverify');
