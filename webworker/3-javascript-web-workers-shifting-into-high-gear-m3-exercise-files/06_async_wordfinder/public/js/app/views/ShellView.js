define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/_Container',
	'./router',
	'./HomeView',
	'./ResultsView',
	'dojo/text!./_templates/ShellView.html'
],
	function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container,
		router, HomeView, ResultsView,
		template) {
		let ShellView = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container], {
			templateString: template,

			views: null,

			constructor: function () {
				this.views= {
					'home': new HomeView(),
					'results': new ResultsView()
				}
			},

			startup: function() {
				this.inherited(arguments);

				router.startup(this);
			},

			setView: function (view) {
				while (this.hasChildren()) {
					this.removeChild(0);
				}

				this.addChild(this.views[view]);
				if (this.views[view].onAppear) {
					this.views[view].onAppear();
				}
			}
		});

		return ShellView;
	}
);