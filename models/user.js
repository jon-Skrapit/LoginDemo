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
UserSchema.methods.setActived = function(code){
    var user = this
    user.actived = true
    user.save(function(err){
        console.log(err)
    })
}
UserSchema.methods.getActived = function(){
    return this.actived
}
module.exports = mongoose.model('users', UserSchema);