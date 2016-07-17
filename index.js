/*
	Thrame Realtime Server.
	V-Alpha?
*/

// for our environment, etc.
require('dotenv').config();

// bring in our CORE application.
var application = require('./app/core');

// This is implemented within our application container.
application.registerDependencies();
application.instansiateRedis();
application.startServer(process.env.SERVER_PORT);
application.registerSocketIoListener();
application.subscribeToCorrectRedisChannel();
application.registerRedisListener();

application.info("Application Registry & Enqueue Process, Completed."); 