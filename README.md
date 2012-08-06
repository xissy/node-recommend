node-recommend
==============

A Node.js module to implement a recommender engine with popular machine-learning algorithms.

## Features

- Inspired by the [*Programming Collective Intelligence*](http://www.amazon.com/Programming-Collective-Intelligence-Applications-ebook/dp/B0028N4WM4) book.
- Getting similiarity with Euclidean distance and Pearson score.
- User and Item by Collarborative Filters.

## Installation

Via npm:

	$ npm install recommend
	
As a submodule of your project (you will also need to install)

	$ git submodule add http://github.com/xissy/node-recommend.git recommend
	$ git submodule update --init

## Usage
### Load in the module

	var recommed = require('recommend');
  
### Watch test sample source code
  
## Changelog

0.0.3:

* Some getting similarity and collarborative filter functions.

## Roadmap

* Implement functions in the [*Programming Collective Intelligence*](http://www.amazon.com/Programming-Collective-Intelligence-Applications-ebook/dp/B0028N4WM4) book.
* Implement algorithms in [*Apache Mahout*](http://mahout.apache.org/) open-source project.