/*
	Thrame Realtime Server.
	V-Alpha?
*/
var application = require('./app/core');

// This is implemented within our application container.
application.registerDependencies();

// This is also implemented within the application container.
application.startServer();

// This is also implemented within the application container.
application.registerSocketIoListener();
application.subscribeToCorrectRedisChannel();
application.registerRedisListener();

application.log("Started Server"); 