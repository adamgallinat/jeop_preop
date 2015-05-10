App.Views.ClueModal = Backbone.View.extend({
	el: '#clueModal',
	initialize: function() {
		this.template = HandlebarsTemplates['cluemodal'];
	},
	render: function() {
		this.buzzed = false;
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.addClass('zoomIn');
		this.$el.show();
		var question = this.model.get('question');
		App.read(question, function() {
			this.flashBuzzDiv();
		}.bind(this));
	},
	events: {
		'click .buzz-light': 'captureBuzz',
		'click .correct': 'addPoints',
		'click .incorrect': 'removePoints'
	},
	captureBuzz: function() {
		if (!this.buzzed) {
			this.buzzed = true;
		} else if ((this.buzzed) && $('.buzz-light').is(':visible')) {
			$('.buzz-light').hide();
			this.renderPlayerAnswer();
		}
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
		$('.buzz-light').show();
		var buzzerTimerLength = Math.random()*(this.model.get('value')*2) + 200;
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
	}
});