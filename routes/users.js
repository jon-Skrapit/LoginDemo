const express = require('express');
const User = require('../models/user');
const config = require('../config');
const router = express.Router();
const tools = require('../util/tools/index')
const logger = require('../util/logs');
const redis = require('../util/redis')
const expire_time = 3600
// 注册账户
/**
 * 
    curl -X POST -H "Content-Type: application/json"      -d '{"email":"example@qq.com","passwd":"123"}'      "localhost:3000/api/getVerificationCode"
 */
router.post('/getVerificationCode', function (req, res) {
    email = req.body.email
    passwd = req.body.passwd
    let result = tools.isEmail(email)
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
                        res.json({status: 500, success:false, msg:"something wrong"})
                        logger.info('something wrong', {email:email,status:500, success:false})
                    }
                    if(!user){
                        res.json({status: 404,success: false, msg:'用户不存在'})
                        logger.info('用户不存在', {email:email,status:404, success:false})
                    }
                    else{
                        res.json({status: 200, success: true, msg: '发送验证码成功'})
                        logger.info('发送验证码成功',{email:email,status:200, success:true})
                        let verificationCode = user.setVerificationCode()
                        redis.set(email,verificationCode)
                        redis.expire(email,expire_time)
                    }
                })
            }else{
                res.json({status: 201,success: true, msg: '成功创建新用户'})
                logger.info('成功创建新用户', {email:email,status:201, success: true})
                let verificationCode = newUser.setVerificationCode()
                redis.set(email,verificationCode)
                redis.expire(email,expire_time)
            }
        })
    }else{
        res.json({status:400,status:"error",msg:"邮箱格式错误"})
        logger.info("邮箱格式错误", {email:email, status:400, status:"error"})
    }
});
/*
    curl -X POST -H "Content-Type: application/json"      -d '{"email":"example@qq.com","verificationCode":"Y2nP"}'      "localhost:3000/api/sendVerificationCode"
*/
router.post('/sendVerificationCode',function (req, res){
    email = req.body.email
    verificationCode = req.body.verificationCode
    User.findOne({
        email: email
    },(err,user)=>{
        if(err){
            throw err
            logger.error({where:'/sendVerificationCode',error:err})
        }
        if(!user){
            res.json({status:404,success: false, msg:'用户不存在'});
            logger.info('用户不存在', {email:email, status:404,success: false})
        }else{
            //从redis中获取验证码
            redis.get(email,function(err,result){
                if(err){
                    logger.error({where:'/sendVerificationCode redis get',error:err})
                }else{
                    if(!result){
                        //如果redis中不存在验证码，则查询mongodb
                        let result = user.compareVerificationCode(verificationCode)
                        if(result){
                            res.json({status:200, success: true, msg:'验证码正确'});
                            logger.info('验证码正确', {email:email, status:200, success: true})
                            user.setActived()
                        }else{
                            res.json({status:206, success: false, msg:'验证码错误或过期'});
                            logger.info('验证码错误或过期',{email:email, status:206, success: false})
                        }
                    }else{
                        //查询redis中的验证码是否正确
                        if(result === verificationCode){
                            res.json({status:200, success: true, msg:'验证码正确'});
                            logger.info('验证码正确', {email:email, status:200, success: true})
                            user.setActived()
                        }else{
                            res.json({status:206, success: false, msg:'验证码错误或过期'});
                            logger.info('验证码错误或过期',{email:email, status:206, success: false})
                        }
                    }
                }
            })
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
            logger.error({where:'/login',error:err})
        }
        if(!user){
            res.json({status:404, success: false, msg:'用户不存在'})
            logger.info('用户不存在', {email:email,status:404, success: false})
        }else if(!user.getActived()){
            res.json({status:406, success: false, msg:'用户未激活'})
            logger.info('用户未激活', {email:email,status:406, success: false})
        }
        else{
            let result = user.comparePassword(passwd)
            if(result){
                res.json({status:200, success:true,msg:"密码正确"})
                logger.info("密码正确", {email:email,status:200, success:true})
            }else{
                res.json({status:401, success:false,msg:"密码错误"})
                logger.info("密码错误", {email:email,status:401, success:false})
            }
        }
    })
})

module.exports = router;