'use strict';

var path = require('path');
var bunyan = require('bunyan');
var config = require('../../config');

var bunyanConfig = {
	name: 'LoginDemo',
	serializers: {
	 req: bunyan.stdSerializers.req,
	 res: bunyan.stdSerializers.res,
	 err: bunyan.stdSerializers.err
	},
	streams: [
		{
			level: 'info',
			type: 'file',
			path: path.join(config.root,'logs/' + config.env + '-' +'info.log'),
		},{
			level: 'trace',
			stream: process.stdout
		},
		{
			level: 'debug',
			stream: process.stderr
		},{
			level: 'error',
			type: 'rotating-file',
			path: path.join(config.root,'logs/' + config.env + '-' +'error.log'),
			period: '1d',   // daily rotation
			count: 7        // keep 7 back copies
		}
	]
}

module.exports = bunyan.createLogger(bunyanConfig);
