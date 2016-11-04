// for our environment, etc.
require('dotenv').config();

// bring in our CORE application.
var application = require('./app/core');

// This is implemented within our application container.
application.registerDependencies();

// Instansiate redis and start server.
application.instansiateRedis();
application.startServer(process.env.SERVER_PORT);

// Register socket.io and subscribe, and register to redis listener.
application.registerSocketIoListener();
application.subscribeToCorrectRedisChannel();
application.registerRedisListener();

// Make sure that our application knows our registry and enqueue process is complete.
application.info("Application Registry & Enqueue Process, Completed."); 