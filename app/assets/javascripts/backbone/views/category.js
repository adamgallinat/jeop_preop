App.Views.Category = Backbone.View.extend({
	className: 'category',
	initialize: function() {
		this.template = HandlebarsTemplates['category'];
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.model.get('clues').forEach(function(clue) {
			var clueModel = new App.Models.Clue(clue);
			var clueView = new App.Views.Clue({model: clueModel});
			this.$el.append(clueView.el);
		}.bind(this));
	}
});