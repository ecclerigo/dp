define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/_base/lang',
	'dojo/dom-class',
	'../model/wordFinder',
	'dojo/text!./_templates/ResultsView.html'
],
	function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
		lang, domClass, wordFinder,
		template) {

		let ResultsView = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,

			postCreate: function () {
				wordFinder.on('searchcomplete', lang.hitch(this, function (e) {
					domClass.add(this.loader, 'hidden');
					this._populateResults(e.words);
				}));
			},

			onAppear: function () {
				this.baseWord = wordFinder.baseWord;
				this.resultsContainer.innerHTML = '';
				this.baseWordNode.innerHTML = this.baseWord;
				domClass.remove(this.loader, 'hidden');
			},

			_populateResults: function (words) {
				let groupedWords = {};
				words.forEach(function (word) {
					if (!groupedWords[word.length]) {
						groupedWords[word.length] = [];
					}

					groupedWords[word.length].push(word);
				});

				let frag = document.createDocumentFragment();
				for (let i = wordFinder.minLetters; i <= this.baseWord.length; i++) {
					if (groupedWords[i]) {
						frag.appendChild(this._renderWordList(i, groupedWords[i]));
					}
				}

				this.resultsContainer.appendChild(frag);
			},

			_renderWordList: function (wordLength, list) {
				list.sort();
				let tbl = document.createElement('table');
				tbl.style.display = 'inline';
				tbl.style.marginLeft = '2em';
				let thead = document.createElement('thead');
				let tbody = document.createElement('tbody');

				tbl.appendChild(thead);
				tbl.appendChild(tbody);

				let tr = document.createElement('tr');
				let th = document.createElement('th');
				th.innerHTML = wordLength + ' letters';

				tr.appendChild(th);
				thead.appendChild(tr);

				list.forEach(function (item) {
					tr = document.createElement('tr');
					td = document.createElement('td');
					td.innerHTML = item;

					tr.appendChild(td);
					tbody.appendChild(tr);
				});

				return tbl;

			}
		});

		return ResultsView;
	}
);