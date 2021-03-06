$(function() {
	if ($('#board').length) {
		App.game = new App.Collections.Game;
		App.game.fetch({
			success: parseRounds
		});
		App.clueModal = new App.Views.ClueModal({model: new App.Models.Clue})
		$('#score').html(0);
		debugger;
		window.speechSynthesis.onvoiceschanged = function () {
			App.voices = speechSynthesis.getVoices();
		}
	}
});

var parseRounds = function() {
	App.game.each(sortClues);
	var roundOneClues = App.game.slice(0,6);
	var roundTwoClues = App.game.slice(6,12);
	var roundThreeClues = App.game.slice(12,13);
	App.roundOne = new App.Collections.Game;
	App.roundTwo = new App.Collections.Game;
	App.roundThree = new App.Collections.Game;
	App.roundOne.set(roundOneClues);
	App.roundTwo.set(roundTwoClues);
	App.roundThree.set(roundThreeClues);
	App.startGame(App.roundOne);
};

var sortClues = function(category) {
	var clueArray = category.get('clues');
	var sortedClues = clueArray.sort(function(a,b) {
		return a.value < b.value ? -1 : 1 
	});
	category.set('clues', sortedClues);
}

App.startGame = function(round) {
	App.board = new App.Views.Board({collection: round, el: '#board'});
};

App.checkForEndOfRound = function() {
	if (!$('.value').length) {
		if (App.board.collection === App.roundOne) {
			debugger;
			App.board.collection = App.roundTwo;
			App.board.render();
		} else if ((App.board.collection === App.roundTwo) && (parseInt($('#score').text()) > 0)) {
			App.board.collection = App.roundThree;
			App.board.renderFinalJeopardy();
		} else {
			App.board.renderFinalScore();
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

App.read = function(script, callback) {
	script = script.replace('<br />', ' ');
	script = script.replace(/__+/, 'blank');
	script = script.replace('<del>', '');
	script = script.replace('</del>', '');

	
	var speech = new SpeechSynthesisUtterance(script);
  var voices = window.speechSynthesis.getVoices();
  speech.default = false;
  if (App.voices) {
  	speech.voice = App.voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
  }
  speech.lang = 'en-US';
  speech.addEventListener('end', function() {
  	callback();
  });
  // speech.onend = callback;
  
  console.log(speech);
  setTimeout(function() {
  	window.speechSynthesis.speak(speech);
  }, 200);
};