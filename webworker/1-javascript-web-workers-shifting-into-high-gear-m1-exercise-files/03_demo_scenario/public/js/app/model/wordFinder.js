define([
	'dojo/_base/declare',
	'dojo/Evented',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dojo/promise/all',
	'dojo/request'
], 
	function (declare, Evented, lang, Deferred, promiseAll, request) {
		let WordFinder = declare(Evented, {
			serviceUrl: null,
			minLetters: 3,

			baseWord: null,

			findWords: function(baseWord, minLetters) {
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
				
				let promises = [];
				for (i in firstLetters) {
					promises.push(this._findWordsStartingWithLetter(i, baseWord));
				}

				promiseAll(promises).then(lang.hitch(this, function (results) {
					let words = results.reduce(function (prev, item) {
						return prev.concat(item);
					});
					this.emit('searchcomplete', {
						words: words
					});
				}));

			},

			_findWordsStartingWithLetter: function (firstLetter, baseWord) {
				let d = new Deferred();

				let words = [];
				let letters = baseWord.split('');

				//store the position of each leter
				let positionsRemaining = letters.map(function (val, idx) {return idx;});
				
				// remove 'firstLetter' from the positions remaining
				let positionsUsed = positionsRemaining.splice(letters.indexOf(firstLetter), 1);
				
				let positionSets = this._determineLetterPositions(positionsUsed, positionsRemaining);
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
						request.get(this.serviceUrl + '/words/' + candidates[i], {handleAs: 'json'});
				}

				words = [];
				promiseAll(promises).then(function (results) {
					for (let i in results) {
						if (results[i]) {
							words.push(i);
						}
					}
					d.resolve(words);

				});
				
				return d.promise;
			},

			_determineLetterPositions: function (positionsUsed, positionsRemaining) {
				let positions = [];
				for (let i = 0; i < positionsRemaining.length; i++) {
					let positionsUsedNew = positionsUsed.concat(positionsRemaining[i]);
					let positionsRemainingNew = positionsRemaining.slice();
					positionsRemainingNew.splice(i,1);

					if (positionsUsedNew.length >= this.minLetters) {
						positions.push(positionsUsedNew);
					}
					positions = positions.concat(
						this._determineLetterPositions(positionsUsedNew, positionsRemainingNew)
					);
				}

				return positions;
			}
		});

		return new WordFinder()
	}
);