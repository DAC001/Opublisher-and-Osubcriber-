/*
 * This file has four API functions 'osubscribe' & 'odisplaySubscriber'
 */
var sync = require('synchronize');
var fiber = sync.fiber;
var await = sync.await;
var defer = sync.defer;
var redis = require('redis');
var client = redis.createClient();

var pub = require('./pub');

module.exports.osubscriber = function osubscriber (channelName) {

var arr = channelName.split(":");
var ByID = arr[0];
var channelName = arr[1];
var msg = ByID +":"+"This Client "+ByID +" Subscribes to Channel "+channelName;

fiber(function(){
	
	pub.opublish('GSC',msg);
	
	console.log("Trying to insert the into the SET");
	//First insert the CHANNEL into the SET if it doesn't exists
	var sismember = await( client.sismember("SUBSCRIBERSET",channelName, defer()));
	

	//It inserts into SET, because CHANNEL been used for the first time
	if(sismember == 0)
	{
		console.log("Add SET");
		client.sadd("SUBSCRIBERSET",channelName);
		console.log("completed");
		var smembers = await (client.smembers("SUBSCRIBERSET",defer()));
		console.log(smembers);
                          
	}
	//CHANNEL is already present in the SET	
	else
	{
                console.log("The Channel already Exists"); 
         	var  secondsmembers = await(client.smembers("SUBSCRIBERSET",defer()));
	        console.log(secondsmembers);
	}
	console.log("Inserting to the Channel's SortedSet");
	var sortedKey = channelName + "Sub";
	await(client.zadd(sortedKey,'1',ByID,defer()));
	var zrange = await(client.zrange(sortedKey,'0','-1',defer()));
	console.log(zrange);
//Subscribe to the channel
	client.on('message', function (channel, message) {
				console.log(message);
			});

	client.subscribe(channelName,function(err,data){
		if(err)
			console.log(err);
		else
			console.log(data);		
	});

});
}	

module.exports.odisplaySubscriber = function odisplaySubscriber(channelName){
var channelName = channelName + "Sub";
fiber(function(){
//Display subscribers of particular channel
	console.log("Subscribers of Channel:",channelName);
	var zrange = await(client.zrange(channelName,'0','-1',defer()));
			console.log(zrange);
	
});
}

