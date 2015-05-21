App.Views.ClueModal = Backbone.View.extend({
	el: '#clueModal',
	initialize: function() {
		this.template = HandlebarsTemplates['cluemodal'];
		this.finalTemplate = HandlebarsTemplates['finaljeopardy'];
	},
	render: function() {
		_.bindAll(this, 'logKeydown');
		$(document).bind('keypress', this.logKeydown);
		this.buzzable = false;
		this.buzzed = false;
		this.buzzDelayed = false;
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
		'click' : 'captureClick',
		'click .correct': 'addPoints',
		'click .incorrect': 'removePoints',
		'click .wager-button': 'makeWager',
		'keydown': 'logKeydown'
	},
	logKeydown: function(e) {
		console.log(e.keyCode);
		if (e.keyCode === 32) {
			this.captureClick();
		}
	},
	captureClick: function() {
		if (!this.buzzed && this.buzzable && !this.buzzDelayed) {
			this.buzzed = true;
			$('.buzz-light').css('border-color', 'lightgreen');
		} else if ((!this.buzzed && !this.buzzable) || this.buzzDelayed) {
			this.delayBuzz();
		} else if (this.buzzed) {
			$('.buzz-light').hide();
			this.renderPlayerAnswer();
		}
	},
	delayBuzz: function() {
		this.buzzDelayed = true;
		setTimeout(function() {
			this.buzzDelayed = false;
		}.bind(this), 1000);
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
		$(document).unbind('keypress', this.logKeydown);
		this.$el.hide();
		App.checkForEndOfRound();
	},
	flashBuzzDiv: function() {
		var buzzerDelayLength = Math.random()*600;
		var buzzerTimerLength = this.timeScale(this.model.get('value')) + 200;
		setTimeout(function() {
			$('.buzz-light').show();
			this.buzzable = true;
			setTimeout(function() {
				if (this.buzzed) {
					$('.buzz-light').css('border-color', 'lightgreen');
				} else {
					$('.buzz-light').css('border-color', 'red');
					this.buzzable = false;
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
	timeScale: function(value) {
		var base;
		if (App.board.collection === App.roundOne) {
			base = (value / 2) + Math.random()*500;
		} else if (App.board.collection === App.roundTwo) {
			base = ((value / 2 + Math.random() * 500) / 2);
		}
		return base;
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