var async = require('async');

var similarity = require('./similarity');
var util = require('./util');


var Recommend = function(dataSet, options) {
	this.dataSet = dataSet;
	// TODO: validate dataSet.
	
	this.options = {
		topMatchesCount: 5,
		recommendationsCount: 5,
		getSimilarity: similarity.getPearson
	};
	util.extend(this.options, options);

	this.reversedDataSet = this.transformPrefs(this.dataSet);
};

/**
 * return the best matches for key from the dataSet object
 */
Recommend.prototype.getTopMatches = function(key, isReverse, callback) {
	var count = this.options.topMatchesCount;
	var getSimilarity = this.options.getSimilarity;
	var dataSet = this.dataSet;

	if (typeof isReverse === 'function') {
		callback = isReverse;
	} else {
		if (isReverse === true) {
			dataSet = this.reversedDataSet;
		}
	}
	
	var scores = [];
	for (var otherKey in dataSet) {
		if (otherKey !== key) {
			scores.push({
				key: otherKey,
				similarity: getSimilarity(dataSet, key, otherKey)
			});
		}
	}
	scores.sort( function(obj1, obj2) {
		return (obj2.similarity - obj1.similarity);
	});

	var result = scores.slice(0, count);
	return callback(null, result);
};

/**
 * get recommendations for a key by using weighted average
 */ 
Recommend.prototype.getRecommendations = function(key, callback) {
	var count = this.options.recommendationsCount;
	var getSimilarity = this.options.getSimilarity;
	var dataSet = this.dataSet;
	
	var totals = {};
	var similaritySums = {};
	
	// don't compare me to myself
	for (var otherKey in dataSet) {
		if (otherKey === key) {
			continue;
		}
		
		var similarity = getSimilarity(dataSet, key, otherKey);
		// ignore scores of zero of lower
		if (similarity <= 0) {
			continue;
		}
		
		// only score items I haven't answered yet
		for (var itemKey in dataSet[otherKey]) {
			if (typeof(dataSet[key][itemKey]) === 'undefined') {
				if (typeof(totals[itemKey]) === 'undefined') {
					totals[itemKey] = 0;
					similaritySums[itemKey] = 0;
				}
				// similarity * score
				totals[itemKey] += dataSet[otherKey][itemKey] * similarity;
				// sum of similarities
				similaritySums[itemKey] += similarity;
			}	
		}
	}
	
	// create the normalized list
	var rankings = [];
	for (var itemKey in totals) {
		rankings.push({
			key: itemKey,
			similarity: totals[itemKey] / similaritySums[itemKey]
		});
	}
	// return the reverse sorted list
	rankings.sort( function(obj1, obj2) {
		return obj2.similarity - obj1.similarity;
	});

	var result = rankings.slice(0, count);
	return callback(null, result);
};

/**
 * flip item and user
 */
Recommend.prototype.transformPrefs = function() {
	var result = {};
	for (var userKey in this.dataSet) {
		var user = this.dataSet[userKey];
		for (var itemKey in user) {
			var item = user[itemKey];

			if (typeof result[itemKey] === 'undefined') {
				result[itemKey] = {};
			}
			result[itemKey][userKey] = item;
		}
	}

	return result;
};

/**
 * create a dictionary of items showing which other items they
 * are most similar to.
 */
Recommend.prototype.calculateSimilarItems = function(callback) {
	var itemKeys = Object.keys( this.reversedDataSet );
	var that = this;

	async.map(
		itemKeys,
		function(key, callback) {
			that.getTopMatches(key, true, callback);
		},
		function(err, topMatchesArray) {
			if (err) {
				return callback(err, null);
			}

			var similarItems = {};
			for (var i = 0; i < topMatchesArray.length; i++) {
				var topMatches = topMatchesArray[i];
				similarItems[ itemKeys[i] ] = topMatches;
			};

			console.log(similarItems);

			return callback(null, similarItems);
		}
	);
};

Recommend.prototype.getRecommendedItems = function(key, callback) {
	this.calculateSimilarItems(function(err, similarItems) {
		var userRatings = this.dataSet[key];
		var scores = {};
		var totalSim = {};

		// loop over items rated by this user
		for (var itemKey in userRatings) {
			var item = userRatings[itemKey];

			// loop over items similar to this one
			for (var item2Key in similarItems) {
				var item2 = similarItems[item2Key];

				// ignore if this user has already rated this item
				if (typeof userRatings[item2Key] !== 'undefined') {
					continue;
				}

				// weighted sum of rating times similarity
				if (typeof scores[item2Key] === 'undefined') {
					scores[item2Key] = 0;
				}
				scores[item2Key] += item2.similarity * item;

				// sum of all the similarties
				if (typeof totalSim[item2Key] === 'undefined') {
					totalSim[item2Key] = 0;
				}
				totalSim[item2Key] += item2.similarity;
			}
		}

		// divide each total score by total weighting to get an average

	});
};


module.exports = Recommend;
