/*
	Application Container.
	-----------------------------
	Realtime functionality, and logging are included, here.
*/
var application = {};

/*
	For accessing dependencies.
*/
application.deps = [];

// functionMessageProperly -- make sure that we're formatting these strings correctly.
function functionMessagePropery(msg) {
	// log our message with a nice timestamp.  This keeps everything organized.
	return msg + " -- " + "(" + (new Date().toLocaleString()) + ")";
}

/*
	application.log(msg);
*/
application.log = function(message) {
	console.log(functionMessagePropery(message));
};

/*
	application.info(msg);
*/
application.info = function(message) {
	console.log(this.accessDependency("colors").green(functionMessagePropery(message)));
};

/*
	application.warn(msg);
*/
application.warn = function(message) {
	console.log(this.accessDependency("colors").red(functionMessagePropery(message)));
};

/*
	application.bringInDependency(depName, callback);
*/
application.bringInDependency = function(dependencyName, callback) {
	console.log("Registering the '" + dependencyName + "' dependency.");
	callback();
};

/*
	application.accessDependency(depName);
*/
application.accessDependency = function(depName) {
	// created a reference to our application container.
	var selfApp = this;
	// make sure to return the correct dependency.
	for(var i = 0; i < selfApp.deps.length; i++) {
		if(selfApp.deps[i][depName] != undefined) {
			return selfApp.deps[i][depName];
		}
	}
	// catch them all..
	return undefined;
}

/*
	Bring in all of our application dependencies.
*/
application.registerDependencies = function() {
	// create a variable reference for our callback functions.
	var selfApp = this;

	// bring in our FAVORITE color handler ;)))).
	selfApp.bringInDependency("colors",function(){
		selfApp.deps.push({
			"colors": require("colors/safe")
		});
	});

	// bring in the http server, and handler.
	selfApp.bringInDependency("httpServer",function(){
		selfApp.deps.push({
			"app": require("http").createServer(function(req,res){
				// some back-to-basics http server stuff.
				res.writeHead(200);
				res.end("");
			})
		});
	});

	// bring in socket io
	selfApp.bringInDependency("io",function(){
		selfApp.deps.push({
			"io": require("socket.io")(selfApp.accessDependency("app"))
		});
	});

	// bring in redis
	selfApp.bringInDependency("redis",function(){
		selfApp.deps.push({
			"redis": require("ioredis")
		});
	});
};

/*
	application.instansiateRedis();
*/
application.instansiateRedis = function() {
	// go ahead and create a "global" redis reference.
	var Redis = this.accessDependency("redis");
	this.redis = new Redis();
};

/*
	application.startServer(port);
*/
application.startServer = function(port) {
	var selfApp = this;
	selfApp.accessDependency("app").listen(port,function(){
		selfApp.info("Server is active && running on port " + port + ".\nPlease be sure to enqueue any commands now.");
	});
};

/*
	application.registerSocketIoListener();
*/
application.registerSocketIoListener = function() {
	var selfApp = this;
	selfApp.accessDependency("io").on("connection",function(socket){
		selfApp.info("Connection Started");
	});
};

/*
	application.subscribeToCorrectRedisChannel();
*/
application.subscribeToCorrectRedisChannel = function() {
	var selfApp = this;
	selfApp.redis.psubscribe("*",function(err, count) {
		selfApp.info("Subscribed to channel.");
	});
}

/*
	application.registerRedisListener();
*/
application.registerRedisListener = function() {
	var selfApp = this;
	selfApp.redis.on("pmessage", function(subscribed, channel, message) {
		// parse the message, and make sure to use our updated JSONparser.
		message = JSON.parse(message);
		// emit and broadcast the correct channel!
		selfApp.accessDependency("io").emit(channel, message.data.data);
	});
}

// make sure to export this application "global" object, so our main portion can access it.
module.exports = application;