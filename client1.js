/*
 * Client create the 'osubscriber' API by passing 'Channel' & 'ClientId' as the parameter.
 */
var redis = require('redis');

global.ByID = 1;
//global.FID = 5;

var channelName = 'STAR Sports';
//var body = "This is client "+ ByID+ " subscriber to channel"+channelName;
var api = require('./sub');
var msg = ByID+":"+ channelName;

//call the 'opublish' API
api.osubscriber(msg);

//call the 'odisplayPublisher' API
//api.odisplaySubscriber(channelName);
                                             
                              
