$(function() {
	if ($('#board').length) {
		App.game = new App.Collections.Game;
		App.game.fetch({
			success: parseRounds
		});
		App.clueModal = new App.Views.ClueModal({model: new App.Models.Clue})
		$('#score').html(0);
	}
});

var parseRounds = function() {
	var roundOneClues = App.game.slice(0,6);
	var roundTwoClues = App.game.slice(6,12);
	App.roundOne = new App.Collections.Game;
	App.roundTwo = new App.Collections.Game;
	App.roundOne.set(roundOneClues);
	App.roundTwo.set(roundTwoClues);
	App.startRound(App.roundOne);
};

App.startRound = function(round) {
	App.board = new App.Views.Board({collection: round, el: '#board'});
};

App.checkForEndOfRound = function() {
	if (!$('.value').length) {
		if (App.board.collection === App.roundOne) {
			debugger;
			App.board.collection = App.roundTwo;
			App.board.render();
		}
	}
};

App.addPoints = function(amount) {
	var score = parseInt($('#score').html());
	score += amount;
	$('#score').html(score);
};

App.removePoints = function(amount) {
	var score = parseInt($('#score').html());
	score -= amount;
	$('#score').html(score);
};