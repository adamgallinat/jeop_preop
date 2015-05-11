App.Views.Board = Backbone.View.extend({
	initialize: function() {
		this.finalScoreTemplate = HandlebarsTemplates['final_score'];
		this.render();
		this.listenTo(this.collection, 'add', this.renderOne);
		this.listenTo(this.collection, 'reset', this.render);
	},
	render: function() {
		this.$el.find('.category').remove();
		this.collection.each(this.renderOne, this);
	},
	renderOne: function(category) {
		var newCategory = new App.Views.Category({model: category});
		this.$el.append(newCategory.el);
	},
	renderFinalJeopardy: function() {
		this.$el.find('.category').remove();
		this.collection.each(this.renderOne, this);
		$('.category').addClass('final')
									.removeClass('category');
		$('.category').append('<>')
	},
	renderFinalScore: function() {
		var score = {score: parseInt($('#score').text())}
		this.$el.html(this.finalScoreTemplate(score));
	}
});