const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const moment = require('moment')
const tools = require('../util/tools/index')
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true, // 不可重复约束
        require: true // 不可为空约束
    },
    passwd: {
        type: String,
        require: true // 不可为空约束
    },
    verificationCode: {
        type: String
    },
    expiration: {
        type: String
    },
    actived: {
        type: Boolean
    }
});
// 添加用户保存时对用户密码进行加密
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        const hash = crypto.createHash('md5');
        user.passwd = hash.update(user.passwd).digest('hex')
        next()
    } else {
        return next();
    }
});
// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(passw) {
    const hash = crypto.createHash('md5');
    passw = hash.update(passw).digest('hex')
    if(this.passwd === passw){
        return true
    }else{
        return false
    }
};
UserSchema.methods.setVerificationCode = function(){
    var user = this
    let expiration = moment().add(20,'m').toDate()
    let verificationCode = tools.randomString(4)
    user.expiration = expiration
    user.verificationCode = verificationCode
    user.update({_id:this._id},{$set:{verificationCode,expiration}},function (err){
        if(!err){
            user.save(function(err){})
        }else{
            console.log(err)
        }
    })
    tools.sendEmail(email,verificationCode)
}
UserSchema.methods.compareVerificationCode = function(code){
    if(code === this.verificationCode){
        let expiration = moment(this.expiration)
        let now = moment()
        if(expiration.isAfter(now)){
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}
UserSchema.methods.setActived = function(code){
    var user = this
    user.update({_id:this._id},{$set:{actived:true}},function (err){
        if(!err){
            user.save(function(err){})
        }else{
            console.log(err)
        }
    })
}
UserSchema.methods.getActived = function(){
    return this.actived
}
module.exports = mongoose.model('users', UserSchema);