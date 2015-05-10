$(function() {
	if ($('#board').length) {
		App.game = new App.Collections.Game;
		App.game.fetch({
			success: parseRounds
		});
		App.clueModal = new App.Views.ClueModal({model: new App.Models.Clue})
		$('#score').html(0);
		window.speechSynthesis.onvoiceschanged = function () {
			App.voices = speechSynthesis.getVoices();
		}
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

App.read = function(script) {
	script = script.split('<br />').join(' ');

	// var msg = new SpeechSynthesisUtterance(script);
	// var voices = window.speechSynthesis.getVoices();
	// msg.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
	// window.speechSynthesis.speak(msg);

	var speech = new SpeechSynthesisUtterance(script);
  var voices = window.speechSynthesis.getVoices();
  speech.default = false;
  speech.voice = App.voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
  speech.lang = 'en-US'; //Also added as for some reason android devices used for testing loaded spanish language 
  window.speechSynthesis.speak(speech);
};