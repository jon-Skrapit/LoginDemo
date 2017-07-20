var nodemailer = require('nodemailer')
var config = require('./config')
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
function sendEmail(email, code){
    var smtpConfig = {
        host: config.fromEmailHost,
        port: config.fromEmailPort,
        auth: {
            user: config.fromEmailAcount,
            pass: config.fromEmailPasswd
        }
    }
    var transporter = nodemailer.createTransport(smtpConfig)
    var option = {
        from: config.fromEmailAcount,
        to:email,
        subject : '验证码',
        html : 'code:'+code
    }
    transporter.sendMail(option,function(error, response){
        if(error){
            console.log("fail: " + error);
        }else{
            console.log("success: " + response.messageID);
        }
    })
}
function isEmail(email){
    var re =/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var result=  re.test(email)
    return result
}
module.exports={
    randomString:randomString,
    sendEmail:sendEmail,
    isEmail:isEmail
}