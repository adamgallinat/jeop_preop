App.Views.Clue = Backbone.View.extend({
	className: 'clue',
	initialize: function() {
		this.template = HandlebarsTemplates['clue'];
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	events: {
		'click' : 'renderQuestion'
	},
	renderQuestion: function() {
		App.clueModal.model = this.model;
		App.clueModal.render();
		this.$el.find('.value').remove();
	}
});