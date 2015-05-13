App.Views.ClueModal = Backbone.View.extend({
	el: '#clueModal',
	initialize: function() {
		this.template = HandlebarsTemplates['cluemodal'];
		this.finalTemplate = HandlebarsTemplates['finaljeopardy'];
	},
	render: function() {
		this.buzzed = false;
		var answer = this.model.get('answer');
		this.model.set('answer', answer.replace('\\', ''));

		if (App.board.collection !== App.roundThree) {
			this.$el.html(this.template(this.model.toJSON()));
			this.renderQuestion();
		} else {
			this.$el.html(this.finalTemplate(this.model.toJSON()));
		}
		this.$el.addClass('zoomIn');
		this.$el.show();
	},
	events: {
		'click .buzz-light': 'captureBuzz',
		'click .correct': 'addPoints',
		'click .incorrect': 'removePoints',
		'click .wager-button': 'makeWager'
	},
	captureBuzz: function() {
		if (!this.buzzed) {
			this.buzzed = true;
		} else if ((this.buzzed) && $('.buzz-light').css('border-color') === 'rgb(144, 238, 144)') {
			$('.buzz-light').hide();
			this.renderPlayerAnswer();
		}
	},
	makeWager: function() {
		var wager = parseInt($('.wager-amount').val());
		var score = parseInt($('#score').text())

		if (wager && wager <= score) {
			this.model.set('value', wager);
			this.renderQuestion();
		} else {
			$('.wager-errors').html('Invalid Wager!');
		}
	},
	renderQuestion: function() {
		$('.wager-holder').hide();
		$('.question-holder').show();
		var question = this.model.get('question');
		App.read(question, function() {
			if (App.board.collection !== App.roundThree) {
				this.flashBuzzDiv();
			} else {
				this.finalJeopardyBuzz();
			}
		}.bind(this));
	},
	renderPlayerAnswer: function() {
		this.$el.find('.question-holder').hide();
		this.$el.find('.player-answer').show();
	},
	renderComputerAnswer: function() {
		this.$el.find('.question-holder').hide();
		this.$el.find('.computer-answer').show();
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
	},
	flashBuzzDiv: function() {
		var buzzerDelayLength = Math.random()*600;
		var buzzerTimerLength = Math.random()*this.model.get('value') + 200;
		setTimeout(function() {
			$('.buzz-light').show();
			setTimeout(function() {
				if (this.buzzed) {
					$('.buzz-light').css('border-color', 'lightgreen');
				} else {
					$('.buzz-light').css('border-color', 'red');
					setTimeout(function() {
						$('.buzz-light').hide();
						this.renderComputerAnswer();
						setTimeout(function() {
							this.hide();
						}.bind(this), 2000);
					}.bind(this), 1000);
				}
			}.bind(this), buzzerTimerLength);
		}.bind(this), buzzerDelayLength);
	},
	finalJeopardyBuzz: function() {
		var buzzerTimerLength = 15000;
		$('.buzz-light').show();
		setTimeout(function() {
			$('.buzz-light').hide();
			this.renderPlayerAnswer();
		}.bind(this), buzzerTimerLength);
	}
});