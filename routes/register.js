/* 使用者註冊會員功能. */
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Signupdata = mongoose.model('Signupdata');
var nodemailer = require('nodemailer');
var md5 = require('md5');


var verifyKey;
// 創建寄信工具
var mailTransport = nodemailer.createTransport({
	service : 'Gmail',
	auth : {
		user : 'certificationnccu@gmail.com',
		pass : 'nccucs103703051'
	}
});

router.post('/', function(req, res, next) {
	console.log("hello");
	Signupdata.find({
		Username : req.body.name
	}, function(err, signupdata, count) {
		console.log(signupdata);
		//檢查名字  
		if (signupdata.length === 0) {
			Signupdata.find({
				StudentID:req.body.ID
			}, function(err, signupdata, count) {
				//檢查ID有沒有被註冊過
				if (signupdata.length === 0) {
					if(req.body.TransactionKey.length >= 8){
						//創建認證碼
						var email = req.body.ID + "@nccu.edu.tw";
						var Info = req.body.name + req.body.ID;
						var transaction = md5(req.body.TransactionKey.toString('binary'));
						verifyKey = md5(Info.toString('binary'));
						console.log(verifyKey);
						new Signupdata({
							Username : req.body.name,
							Email : email,
							StudentID : req.body.ID,
							TransactionKey : transaction,
							Password : req.body.password,
							CreateDate : Date.now(),
							Verifykey: verifyKey
						}).save(function(err) { //將帳密儲存到資料庫裡
							if (err) {
								console.log('Signupdata Fail to save to DB.');
								return;
							}
							console.log('Signupdata Save to DB.');
							
							mailTransport.sendMail({
								from : 'certificationnccu@gmail.com',
								to : email,
								subject : '政大點數系統驗證信',
								html : '<h2>這是您的驗證碼</h2> <p>' + verifyKey + '</p>',
							}, function(err) {
								if (err) {
									console.error('Unable to send confirmation: ' + err.stack);
								}
							});
							//req.session.ID = req.body.ID;
							//req.session.username = req.body.name;
							//req.session.password = req.body.password;
							res.redirect('../verify');
						      
						});
					}
					else{
						res.render('register', {
							message : "TransactionKEY長度須為8個字以上 "
						});
					}
				}
				else{
					//req.session.logined = false;
					res.render('register', {
						message : "ID : " + req.body.ID + " 被申請過了喔 "
					});
				}				
			});
		} else {
			//req.session.logined = false;
			res.render('register', {
				message : "名字: " + req.body.name + " 被申請過了喔 "
			});
		}
	});
});


module.exports = router;