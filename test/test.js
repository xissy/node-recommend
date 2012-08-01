var should = require('should');

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


describe('Recommend', function() {
	var recommend = undefined;
	var key = undefined;
	var key1 = undefined;
	var key2 = undefined;

	before( function(done) {
		recommend = new Recommend(dataSet);
		key = getRandomKey(dataSet);
		key1 = getRandomKey(dataSet);
		key2 = getRandomKey(dataSet);

		should.exist(recommend);
		should.exist(recommend.dataSet);
		should.exist(recommend.reversedDataSet);
		should.exist(key);
		should.exist(key1);
		should.exist(key2);

		done();
	});

	describe('similarity', function() {
		it('#getDistance()', function(done) {
			var distance = similarity.getDistance(dataSet, key1, key2);
			should.exist(distance);
			// console.log( 'similarity.getDistance(dataSet, ' + key1 + ', ' + key2 + ') === ' + distance );

			done();
		});

		it('#getPearson()', function(done) {
			var pearsonScore = similarity.getPearson(dataSet, key1, key2);
			should.exist(pearsonScore);
			// console.log( 'similarity.getPearson(dataSet, ' + key1 + ', ' + key2 + ') === ' + pearsonScore );

			done();
		});
	});

	describe('recommend', function() {
		it('#getTopMatches()', function(done) {
			recommend.getTopMatches(key, function(err, topMatches) {
				should.not.exist(err);
				should.exist(topMatches);

				done();
			});
		});

		it('#getRecommendations()', function(done) {
			recommend.getRecommendations(key, function(err, recommendations) {
				should.not.exist(err);
				should.exist(recommendations);

				done();
			});
		});

		it('#transformPrefs()', function(done) {
			var result = recommend.transformPrefs();
			should.exist(result);

			done();
		});

		it('#calculateSimilarItems()', function(done) {
			recommend.calculateSimilarItems( function(err, similarItems) {
				should.not.exist(err);
				should.exist(similarItems);

				done();
			});
		})
	});

});
