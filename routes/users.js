const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const util = require('../util')
// 注册账户
/**
 * 
    curl -X POST -H "Content-Type: application/json"      -d '{"email":"example@qq.com","passwd":"123"}'      "localhost:3000/api/getVerificationCode"
 */
router.post('/getVerificationCode', function (req, res) {
    email = req.body.email
    passwd = req.body.passwd
    let result = util.isEmail(email)
    if(result){
        var newUser = new User({
            email: email,
            passwd: passwd,
            actived:false
        })
        newUser.save((err) =>{
            if(err){
                User.findOne({
                    email:email
                },(err,user)=>{
                    if(err){
                        res.json({status: 500, message:"something wrong"})
                    }
                    if(!user){
                        res.json({status: 404,success: false, message:'用户不存在'})
                    }
                    else{
                        res.json({status: 200, success: true, message: '发送验证码成功'})
                        user.setVerificationCode()
                    }
                })
            }else{
                res.json({status: 201,success: true, message: '成功创建新用户!'})
                newUser.setVerificationCode()
            }
        })
    }else{
        res.json({status:400,status:"error",message:"邮箱格式错误"})
    }
});
/*
    curl -X POST -H "Content-Type: application/json"      -d '{"email":"example@qq.com","verificationCode":"YA8Q"}'      "localhost:3000/api/sendVerificationCode"
*/
router.post('/sendVerificationCode',function (req, res){
    email = req.body.email
    verificationCode = req.body.verificationCode
    User.findOne({
        email: email
    },(err,user)=>{
        if(err){
            throw err
        }
        if(!user){
            res.json({status:404,success: false, message:'用户不存在'});
        }else{
            let result = user.compareVerificationCode(verificationCode)
            if(result){
                res.json({status:200, success: true, message:'验证码正确'});
                user.setActived()
            }else{
                res.json({status:206, success: false, message:'验证码错误或过期'});
            }
        }
    })
})
/**
     curl -X POST -H "Content-Type: application/json"      -d '{"email":"example@qq.com","passwd":"123"}'      "localhost:3000/api/login"
 */
router.post('/login',function(req,res){
    email = req.body.email
    passwd = req.body.passwd
    User.findOne({
        email: email
    },(err,user)=>{
        if(err){
            throw err
        }
        if(!user){
            res.json({status:404, success: false, message:'用户不存在'})
        }else{
            let result = user.comparePassword(passwd)
            if(result){
                res.json({status:200, success:true,message:"密码正确"})
            }else{
                res.json({status:401, success:false,message:"密码错误"})
            }
        }
    })
})

module.exports = router;