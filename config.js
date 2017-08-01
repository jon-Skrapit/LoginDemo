/**
启动mongodb服务： mongod --dbpath ~/data/db
通过brew启动redis：brew services start redis
 */
var path = require('path');
var config = {
    root: path.normalize(__dirname),
    env: process.env.NODE_ENV,
    mongodb:{
        url:'mongodb://localhost:27017/test'
    },
    smtpEmail:{
        name:'example@163.com',
        password:'xxxx',
        host:'smtp.163.com',
        port:456
    },
    express:{
        port: process.env.PORT || 3000
    },
    redis: {
        host: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
        port: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
        password: process.env.REDIS_PASSWORD || ''
    }
}
module.exports = config