/*
 * Client create the 'opublish' API by passing 'Channel', 'Message' & 'ClientId' as the parameter.
 */
var redis = require('redis');

global.ByID = 10;
//global.FID = 5;

var channelName = 'STAR Sports';
var body = "This is STAR Sports channel";
var api = require('./pub');
var msg = ByID+":"+body

//call the 'opublish' API
api.opublish(channelName,msg);

//call the 'odisplayPublisher' API
//api.odisplayPublisher(channelName);
                                             
                              
