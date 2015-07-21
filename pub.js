/*
 * This file has four API functions 'opublish' &'odisplayPublisher'
 */
var sync = require('synchronize');
var fiber = sync.fiber;
var await = sync.await;
var defer = sync.defer;
var redis = require('redis');
var client = redis.createClient();

module.exports.opublish = function opublish (channelName,msg){

var arr = msg.split(":");
var ByID = arr[0];
var body = arr[1];
fiber(function(){
	
//First insert the CHANNEL into the SET if it doesn't exists
	console.log("Trying to insert the into the SET");
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
//Insert CHANNELNAME, PUBLISHERID,SUBSCRIBERID
			console.log("Inserting to the Channel's SortedSet");
			console.log("channel",channelName);
			var zadd = await(client.zadd(channelName,'3',ByID,defer()));
			var zrange = await(client.zrange(channelName,'0','-1',defer()));
			console.log(zrange);
//Publish message on the channel
			client.publish(channelName,body,function(err,data){
				console.log(data);	
			});
		
});

}


module.exports.odisplayPublisher = function odisplayPublisher(channelName){
fiber(function(){
//Display publishers of particular channel
	console.log("Publishers of Channel:",channelName);
	var zrange = await(client.zrange(channelName,'0','-1',defer()));
			console.log(zrange);
	
	});
}


