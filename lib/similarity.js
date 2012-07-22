
var sumOfArray = function(array) {
	var sum = 0;
	for (var i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
};

// returns a distance-based(euclidean distance) similarity score for key1 and key22
exports.getDistance = function(dataSet, key1, key2) {
	// get the list of shared_items
	var sharedItems = {};
	for (var itemKey in dataSet[key1]) {
		if (typeof(dataSet[key2][itemKey]) !== 'undefined') {
			sharedItems[itemKey] = 1;
		}
	}
	
	// if they have no ratings in common, return 0
	if (Object.keys(sharedItems).length === 0) {
		return 0;
	}
	
	// add up the squares of all the differences
	var squares = [];
	for (var itemKey in dataSet[key1]) {
		if (typeof(dataSet[key2][itemKey]) !== 'undefined') {
			var square = Math.pow( dataSet[key1][itemKey] - dataSet[key2][itemKey], 2 );
			squares.push( square );
		}
	}
	
	return 1 / ( 1 + sumOfArray(squares) );
};

// returns the Parson correlation coefficient for key1 and key2
exports.getPearson = function(dataSet, key1, key2) {
	// get the list of mutially rated items
	var sharedItems = {};
	for (var itemKey in dataSet[key1]) {
		if (typeof(dataSet[key2][itemKey]) !== 'undefined') {
			sharedItems[itemKey] = 1;
		}
	}
	
	var sharedItemsLength = Object.keys(sharedItems).length;
	
	// if they have no ratings in common, return 0
	if (sharedItemsLength === 0) {
		return 0;
	}
	
	var sum1 = 0;
	var sum2 = 0;
	var sum1Sq = 0;
	var sum2Sq = 0;
	var sharedItemsSum = 0;
	for (var itemKey in sharedItems) {
		// sums of all the items
		sum1 += dataSet[key1][itemKey];
		sum2 += dataSet[key2][itemKey];
		
		// sums of the squares
		sum1Sq += Math.pow( dataSet[key1][itemKey], 2 );
		sum2Sq += Math.pow( dataSet[key2][itemKey], 2 );
		
		// sum of the sharedItems
		sharedItemsSum += dataSet[key1][itemKey] * dataSet[key2][itemKey];
	}
	
	// calculate r (Pearson score)
	var num = sharedItemsSum - (sum1 * sum2 / sharedItemsLength);
	var den = Math.sqrt( 
		(sum1Sq - Math.pow(sum1, 2) / sharedItemsLength) * 
		(sum2Sq - Math.pow(sum2, 2) / sharedItemsLength) 
	);
	
	if (den === 0) {
		return 0;
	}
	
	return num / den;
};
