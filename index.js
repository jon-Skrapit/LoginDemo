const express = require('express');
const app = express();
const bodyParser = require('body-parser');// 解析body字段模块
const morgan = require('morgan'); // 命令行log显示
const mongoose = require('mongoose');
const routes = require('./routes'); //路由配置
const config = require('./config'); //全局配置

let port = config.express.port;

app.use(morgan('dev'));// 命令行中显示程序运行日志,便于bug调试
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // 调用bodyParser模块以便程序正确解析body传入值

routes(app); // 路由引入

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url,{useMongoClient:true}); // 连接数据库

app.listen(port, (err,db) => {
  console.log('listening on port : ' + port);
})