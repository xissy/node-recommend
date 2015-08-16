var should = require('should');

var dataSet = require('./dataSet');

var similarity = require('../lib/similarity');
var Recommend = require('../lib/recommend');


describe('Recommend', function() {
	describe('similarity', function() {
		function createDataSet() {
			return Array.prototype.reduce.call(arguments, function addUserToDataSet(dataSet, arg, index) {
				dataSet[index] = {};
				arg.forEach(function copyDefinedItems(score, item) {
					if (score !== undefined) {
						dataSet[index][item] = score;
					}
				});
				return dataSet;
			}, {});
		}

		describe('#getDistance()', function() {

			it('should be 1 for the same user', function () {
				var distance = similarity.getDistance(createDataSet([1], [1]), 0, 0);
				should.equal(distance, 1);
			});

			it('should be 0 for users with no shared items', function () {
				var distance = similarity.getDistance(createDataSet([1, undefined], [undefined, 1]), 0, 1);
				should.equal(distance, 0);
			});

			it('should be 1 for users if the shared items have the same score', function () {
				var distance = similarity.getDistance(createDataSet([1, 1, undefined], [undefined, 1, 3]), 0, 1);
				should.equal(distance, 1);
			});

			it('should be 0.5 for users if there is one shared item but the scores differ by 1', function () {
				var distance = similarity.getDistance(createDataSet([1], [2]), 0, 1);
				should.equal(distance, 0.5);
			});
		});

		it('#getPearson()', function(done) {
			var pearsonScore = similarity.getPearson(createDataSet([1], [2]), 0, 1);
			should.exist(pearsonScore);
			// console.log( 'similarity.getPearson(dataSet, ' + key1 + ', ' + key2 + ') === ' + pearsonScore );

			done();
		});
	});

	describe('recommend', function() {
		var recommend = undefined;
		var key = undefined;
		var key1 = undefined;
		var key2 = undefined;

		var getRandomInteger = function(min, max) {
			return Math.floor( Math.random() * max ) + min;
		};

		var getRandomKey = function(dataSet) {
			var keys = Object.keys(dataSet);
			var rand = getRandomInteger(0, keys.length);
			return keys[rand];
		};

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
