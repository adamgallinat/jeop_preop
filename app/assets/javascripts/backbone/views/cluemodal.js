App.Views.ClueModal = Backbone.View.extend({
	el: '#clueModal',
	initialize: function() {
		this.template = HandlebarsTemplates['cluemodal'];
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.addClass('zoomIn');
		this.$el.show();
	},
	events: {
		'click': 'renderNext',
		'click .correct': 'addPoints',
		'click .incorrect': 'removePoints'
	},
	renderNext: function() {
		if (!this.$el.find('.question-holder').attr('style')) {
			this.renderAnswer();
		}
	},
	renderAnswer: function() {
		this.$el.find('.question-holder').hide();
		this.$el.find('.answer-holder').show();
	},
	addPoints: function() {
		App.addPoints(this.model.get('value'));
		this.hide();
	},
	removePoints: function() {
		App.removePoints(this.model.get('value'));
		this.hide();
	},
	hide: function() {
		this.$el.html('');
		this.$el.removeClass('zoomIn');
		this.$el.hide();
		App.checkForEndOfRound();
	}
});