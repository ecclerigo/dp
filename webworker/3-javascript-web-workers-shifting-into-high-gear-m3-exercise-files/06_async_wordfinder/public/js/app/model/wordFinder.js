define([
	'dojo/_base/declare',
	'dojo/Evented',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dojo/promise/all',
	'dojo/request'
], 
	function (declare, Evented, lang, Deferred, promiseAll, request) {
		let nextCorrelationId = 1,
			callbacks = {};

		let WordFinder = declare(Evented, {
			serviceUrl: null,
			minLetters: 3,

			baseWord: null,

			findWords: function(baseWord, minLetters) {
				let workers = [];

				this.baseWord = baseWord;
				this.minLetters = minLetters || this.minLetters;
				baseWord = baseWord.toLowerCase();
				let firstLetters = {};
				for (let i = 0; i < baseWord.length; i++) {
					if (baseWord[i] in firstLetters) {
						continue;
					} else {
						// value doesn't matter, just capturing key
						firstLetters[baseWord[i]] = true;
					}
				}
				
				let promises = [],
					functionParts = this._getFunctionParts(this._findWordsStartingWithLetter);
				
				for (i in firstLetters) {
					let isAsync = false;
					if (isAsync) {
						let worker = this._createWorker();

						worker.addEventListener('message', function (e) {
							if (e.data.correlationId) {
								callbacks[e.data.correlationId](e.data.result);
								delete callbacks[e.data.correlationId];
							}
						})

						worker.postMessage({
							type: 'registerFunction',
							name: 'findWordsStartingWithLetter',
							parameters: functionParts.parameters,
							body: functionParts.body,
							isAsync: true
						});

						workers.push(worker);

						let msg = {
							type: 'findWordsStartingWithLetter',
							args: [i, baseWord, this.minLetters, this.serviceUrl],
							correlationId: 'wordFinder_' + nextCorrelationId++
						};

						let deferred = new Deferred();

						callbacks[msg.correlationId] = function (result) {
							deferred.resolve(result.value);
						}

						worker.postMessage(msg);

						promises.push(deferred.promise);
					} else {
						promises.push(this._findWordsStartingWithLetter(i, baseWord, this.minLetters, this.serviceUrl));
					}
					
				}

				promiseAll(promises).then(lang.hitch(this, function (results) {
					let words = results.reduce(function (prev, item) {
						return prev.concat(item);
					});
					this.emit('searchcomplete', {
						words: words
					});

					workers.forEach(function (worker) {
						worker.terminate();
					});
				}));

			},

			_createWorker: function () {
				let worker = new Worker('/js/worker.js');
				worker.postMessage({
					type: 'config',
					options: {
						async: true,
						baseUrl: '/node_modules/dojo'
					}
				});
				worker.postMessage({
					type: 'loadScript',
					url: '/node_modules/dojo/dojo.js'
				});

				return worker;
			},

			_getFunctionParts: function (func) {
				let regExp = /\((.*)\).*\{([\s\S]*)\}/m,
					funcParts = regExp.exec(func.toString());

				return {
					parameters: funcParts[1],
					body: funcParts[2]
				};
			},

			_findWordsStartingWithLetter: function (firstLetter, baseWord, minLetters, serviceUrl) {
				let promise = new Promise(function (resolve, reject) {
					require(['dojo/request', 'dojo/promise/all'], 
					function (request, promiseAll) {
						function _determineLetterPositions(positionsUsed, positionsRemaining) {
							
							let positions = [];
							for (let i = 0; i < positionsRemaining.length; i++) {
								let positionsUsedNew = positionsUsed.concat(positionsRemaining[i]);
								let positionsRemainingNew = positionsRemaining.slice();
								positionsRemainingNew.splice(i,1);

								if (positionsUsedNew.length >= minLetters) {
									positions.push(positionsUsedNew);
								}
								positions = positions.concat(
									_determineLetterPositions(positionsUsedNew, positionsRemainingNew)
								);
							}

							return positions;
						};
						let words = [];
						let letters = baseWord.split('');

						//store the position of each leter
						let positionsRemaining = letters.map(function (val, idx) {return idx;});
						
						// remove 'firstLetter' from the positions remaining
						let positionsUsed = positionsRemaining.splice(letters.indexOf(firstLetter), 1);
						
						let positionSets = _determineLetterPositions(positionsUsed, positionsRemaining);
						let candidates = [];
						for (let i = 0; i < positionSets.length; i++) {
							let currentPositionSet = positionSets[i]
							let word = [];
							for (let j = 0; j < currentPositionSet.length; j++) {
								word.push(letters[currentPositionSet[j]]);
							}
							word = word.join('');
							candidates.push(word);
						}
						let promises = {};
						for (i = 0; i < candidates.length; i++) {
							promises[candidates[i]] =
								request.get(serviceUrl + '/words/' + candidates[i], {handleAs: 'json'});
						}

						words = [];
						promiseAll(promises).then(function (results) {
							for (let i in results) {
								if (results[i]) {
									words.push(i);
								}
							}
							resolve(words);
						});
					});
				});

				return promise;
			},
		});

		return new WordFinder()
	}
);