/**
启动mongodb服务： mongod --dbpath ~/data/db
通过brew启动redis：brew services start redis
 */
var config = {
    mongodb:{
        url:'mongodb://localhost:27017/test'
    },
    smtpEmail:{
        name:'13824380038@163.com',
        password:'exer1234',
        host:'smtp.163.com',
        port:456
    },
    express:{
        port: process.env.PORT || 3000
    }
}
module.exports = config