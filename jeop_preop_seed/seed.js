var request = require('request'),
		cheerio = require('cheerio'),
		iconvlite = require('iconv-lite'),
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
	// seasons.splice(0,27);
	// console.log(seasons);
	requestEachSeason(seasons);
});

var requestEachSeason = function(seasons) {
	// seasons.forEach(function(season) {
		request({
			url: seasons[16].link,
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
					requestEpisode(linkString, seasons[16].number, airDate);
				}
			}
		});
	// });
};

// EPISODE FUNCTION

var requestEpisode = function(episodeUrl, seasonNumber, airDate) {
	request({
		method: 'GET',
		url: episodeUrl,
		encoding: null
	}, function(err, res, body) {
		body = iconvlite.decode(body, 'ISO-8859-1');
		processFirstRoundCategories(body, seasonNumber, airDate);
		processSecondRoundCategories(body, seasonNumber, airDate);
		processFinalJeopardy(body, seasonNumber, airDate);
	});
};

var processFirstRoundCategories = function(html, seasonNumber, airDate) {
	$ = cheerio.load(html);
	var first_round_categories = $('#jeopardy_round .category_name');
	var categories = [];
	for (var i = 0; i < first_round_categories.length; i++) {
		var newCategory = {
			title: $(first_round_categories[i]).text(),
			season: seasonNumber,
			air_date: airDate,
			round: 'jeopardy'
		};
		categories.push(newCategory);
	}
	processFirstRoundClues(html, categories);
};

var processFirstRoundClues = function(html, categories) {
	Category.bulkCreate(categories, {returning: true})
		.then(function(savedCategories) {
			
			$ = cheerio.load(html);
			var categoryIDs = savedCategories.map(function(savedCategory) {
				return savedCategory.get('id');
			});

			var clues = [];
			var first_round_clue_els = $('#jeopardy_round .clue');
			for (var j = 0; j < first_round_clue_els.length; j++) {
				clues.push(returnHashOfClue($(first_round_clue_els[j])));
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
			// console.log(cluesToUpload);
			Clue.bulkCreate(cluesToUpload);
		});
};


var processSecondRoundCategories = function(html, seasonNumber, airDate) {
	$ = cheerio.load(html);
	var first_round_categories = $('#double_jeopardy_round .category_name');
	var categories = [];
	for (var i = 0; i < first_round_categories.length; i++) {
		var newCategory = {
			title: $(first_round_categories[i]).text(),
			season: seasonNumber,
			air_date: airDate,
			round: 'double jeopardy'
		};
		categories.push(newCategory);
	}
	processSecondRoundClues(html, categories);
};

var processSecondRoundClues = function(html, categories) {
	Category.bulkCreate(categories, {returning: true})
		.then(function(savedCategories) {
			
			$ = cheerio.load(html);
			var categoryIDs = savedCategories.map(function(savedCategory) {
				return savedCategory.get('id');
			});

			var clues = [];
			var first_round_clue_els = $('#double_jeopardy_round .clue');
			for (var j = 0; j < first_round_clue_els.length; j++) {
				clues.push(returnHashOfClue($(first_round_clue_els[j])));
			}

			var clueIndex = 0;
			var cluesToUpload = [];
			for (var row = 0; row < 5; row++) {
				for (var col = 0; col < 6; col++) {
					var currentClue = clues[clueIndex];
					currentClue.category_id = categoryIDs[col];
					currentClue.value = (row+1) * 400;
					cluesToUpload.push(currentClue);
					clueIndex++;
				}
			}
			// cluesToUpload.sort(compareClues);
			Clue.bulkCreate(cluesToUpload);
		});
};

var processFinalJeopardy = function(html, seasonNumber, airDate) {
	$ = cheerio.load(html);
	var categoryName = $('.final_round .category_name').text();
	var newCategory = {
		title: categoryName,
		season: seasonNumber,
		air_date: airDate,
		round: 'final jeopardy'
	};
	Category.create(newCategory, {returning: true})
		.then(function(savedCategory) {
			$ = cheerio.load(html);
			var categoryID = savedCategory.get('id');
			var answerBody = $('#final_jeopardy_round .category').find('div').attr('onmouseover');
			var answer = answerBody.split('<em class=\\"correct_response\\">')[1]
														 .split('</em>')[0]
														 .replace(/\\'/g, "'");
			var newClue = {
				question: $('#final_jeopardy_round .clue_text').text(),
				answer: answer,
				daily_double: false,
				value: 0,
				category_id: categoryID
			};
			Clue.create(newClue);
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

// requestEpisode('http://www.j-archive.com/showgame.php?game_id=4732', 30, '2015-08-8');