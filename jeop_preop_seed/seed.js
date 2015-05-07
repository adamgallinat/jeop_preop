var request = require('request'),
		cheerio = require('cheerio'),
		models = require('./models'),
		Category = models.categories,
		Clue = models.clues;

request({
	url: 'http://j-archive.com/listseasons.php',
	method: 'GET'
}, function(err, res, body) {
	var $ = cheerio.load(body);
	var seasonElements = $('table a');
	var seasons = [];
	for (var i = 0; i < seasonElements.length; i++) {
		var season = {};
		season.link = 'http://j-archive.com/' + $(seasonElements[i]).attr('href');
		season.number = $(seasonElements[i]).attr('href').split('=')[1];
		seasons.unshift(season);
	}
	seasons.shift();
	seasons.splice(6,1);
	requestEachSeason(seasons);
});

var requestEachSeason = function(seasons) {
	// seasons.forEach(function(season) {
		request({
			url: seasons[29].link,
			method: 'GET'
		}, function(err, res, body) {
			var $ = cheerio.load(body);
			var episodes = $('table a');
			for (var i = 0; i < episodes.length; i++) {
				var linkString = $(episodes[i]).attr('href');
				var airDate = $(episodes[i]).text();
				if (airDate.indexOf('aired') !== -1) {
					airDate = airDate.split('aired')[1].substr(1);
				}
				if (linkString.indexOf('showgame') !== -1) {
					processEpisode(linkString, seasons[29].number, airDate);
				}
			}
		});
	// });
};

// EPISODE FUNCTION

var getRoundOne = function(categoryEls, seasonNumber, airDate) {
	var categories = [];
		for (var i = 0; i < categoryEls.length; i++) {
			var category = {
				title: $(categoryEls[i]).text(),
				season: seasonNumber,
				air_date: airDate,
				round: 'jeopardy'
			};
			categories.push(category);
		}
		Category.bulkCreate(categories, {returning: true})
			.then(function(savedCategories) {
				var categoryIDs = savedCategories.map(function(savedCategory) {
					return savedCategory.get('id');
				});

				var clues = [];
				var first_round_clues = $('#jeopardy_round .clue');
				for (var j = 0; j < first_round_clues.length; j++) {
					clues.push(returnHashOfClue($(first_round_clues[j])));
				}
				
				var clueIndex = 0;
				var cluesToUpload = [];
				for (var row = 0; row < 5; row++) {
					for (var col = 0; col < 6; col++) {
						var currentClue = clues[clueIndex];
						currentClue.category_id = categoryIDs[col];
						currentClue.value = (row+1) * 100;
						cluesToUpload.push(currentClue);
						clueIndex++;
					}
				}
				Clue.bulkCreate(cluesToUpload);
			});
};

var getRoundTwo = function(categoryEls, seasonNumber, airDate) {
	var categories = [];
		for (var i = 0; i < categoryEls.length; i++) {
			var category = {
				title: $(categoryEls[i]).text(),
				season: seasonNumber,
				air_date: airDate,
				round: 'double jeopardy'
			};
			categories.push(category);
		}
		Category.bulkCreate(categories, {returning: true})
			.then(function(savedCategories) {
				var categoryIDs = savedCategories.map(function(savedCategory) {
					return savedCategory.get('id');
				});

				var clues = [];
				var second_round_clues = $('#double_jeopardy_round .clue');
				for (var j = 0; j < second_round_clues.length; j++) {
					clues.push(returnHashOfClue($(second_round_clues[j])));
				}
				
				var clueIndex = 0;
				var cluesToUpload = [];
				for (var row = 0; row < 5; row++) {
					for (var col = 0; col < 6; col++) {
						var currentClue = clues[clueIndex];
						currentClue.category_id = categoryIDs[col];
						currentClue.value = (row+1) * 200;
						cluesToUpload.push(currentClue);
						clueIndex++;
					}
				}
				Clue.bulkCreate(cluesToUpload);
			});
};

var processEpisode = function(episodeUrl, seasonNumber, airDate) {
	request({
		url: episodeUrl,
		method: 'GET'
	}, function(err, res, body) {
		$ = cheerio.load(body);
		var first_round_categories = $('#jeopardy_round .category_name');
		getRoundOne(first_round_categories, seasonNumber, airDate);
		var second_round_categories = $('#double_jeopardy_round .category_name');
		getRoundTwo(second_round_categories, seasonNumber, airDate);
	});
};

var returnHashOfClue = function(rawClue) {
	if (!rawClue.html().trim()) {
		return {answer: '', question: ''};
	}
	var questionBody = (rawClue.find('div').attr('onmouseout'));
	var answerBody = (rawClue.find('div').attr('onmouseover'));
	var question = questionBody.split("stuck', '")[1].split("')")[0]
														 .replace(/\\\'/g, "'");
	var answer = answerBody.split('<em class="correct_response">')[1].split('</em')[0];

	var response = {answer: answer, question: question};
	if (rawClue.find('.clue_value_daily_double').html()) {
		response.daily_double = true;
	} else {
		response.daily_double = false;
	}
	return response;
};