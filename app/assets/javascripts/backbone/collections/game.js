App.Collections.Game = Backbone.Collection.extend({
	model: App.Models.Category,
	url: '/api/new_game'
});