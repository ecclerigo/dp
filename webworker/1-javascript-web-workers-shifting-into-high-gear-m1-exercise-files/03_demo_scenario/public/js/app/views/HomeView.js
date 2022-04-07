define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/router',
	'../model/wordFinder',
	'dojo/text!./_templates/HomeView.html'
],
	function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
		router, wordFinder,
		template) {

		let uId = 0;

		let HomeView = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			textId: null,

			constructor: function () {
				this.textId = "text_id_" + uId++;
			},

			submit: function (e) {
				e.preventDefault();
				let baseWord = this.wordNode.value;

				wordFinder.findWords(baseWord);
				router.go('/results');
			}
		});

		return HomeView;

	}
);