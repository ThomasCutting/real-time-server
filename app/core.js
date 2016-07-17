/*
	Thrame Application Container.
	-----------------------------
	Realtime functionality, and logging are included, here.
*/
var application = {};

/*
	For accessing dependencies.
*/
application.deps = {};

/*
	application.log(msg);
*/
application.log = function(message) {
	// log our message with a nice timestamp.  This keeps everything organized.
	console.log(message + " -- (" + (new Date().toLocaleString()) + ")");
};

/*
	application.bringInDependency(depName, callback);
*/
application.bringInDependency = function(dependencyName, callback) {
	console.log("Registering the '" + dependencyName + "' dependency.");
	callback();
};

application.accessDependency = function(depName) {
	return deps[depName];
}

/*
	Bring in all of our application dependencies.
*/
application.registerDependencies = function() {
	// create a variable reference for our callback functions.
	var selfApp = this;
	
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
		// TODO: Here!!
	});
}

// make sure to export this application "global" object, so our main portion can access it.
module.exports = application;