var dataSet = require('./dataSet');

var similarity = require('../lib/similarity');
var Recommend = require('../lib/recommend');


var getRandomInteger = function(min, max) {
	return Math.floor( Math.random() * max ) + min;
};

var getRandomKey = function(dataSet) {
	var keys = Object.keys(dataSet);
	var rand = getRandomInteger(0, keys.length);
	return keys[rand];
};


var recommend = new Recommend(dataSet);
var key1 = getRandomKey(dataSet);
var key2 = getRandomKey(dataSet);

var similarityTest = function(dataSet, key1, key2) {	
	var distance = similarity.getDistance(dataSet, key1, key2);	
	console.log( 'similarity.getDistance(dataSet, ' + key1 + ', ' + key2 + ') === ' + distance );
	
	var pearsonScore = similarity.getPearson(dataSet, key1, key2);
	console.log( 'similarity.getPearson(dataSet, ' + key1 + ', ' + key2 + ') === ' + pearsonScore );
};

var getTopMatchesTest = function(dataSet, key) {
	var result = recommend.getTopMatches(key);
	console.log( 'Recommend.getTopMatches(' + key + ') === ' + JSON.stringify(result) );
};

var getRecommendationsTest = function(dataSet, key) {
	var result = recommend.getRecommendations(key);
	console.log( 'Recommend.getRecommendations(' + key + ') === ' + JSON.stringify(result) );
};

similarityTest(dataSet, key1, key2);
getTopMatchesTest(dataSet, key1);
getRecommendationsTest(dataSet, key1);
