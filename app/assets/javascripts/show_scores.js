$(function() {
	if ($('#score-graph').length) {
		var id, scores;
		$.get('/current_user')
			.done(function(userData) {
				id = userData.id;
				$.get('/scores/by_user/' + id)
					.done(function(scoreData) {
						scores = scoreData;
						renderScoreGraph(scores);
					});
			});
	}
});

var renderScoreGraph = function(scores) {
	if (scores.length > 1) {
		var vis = d3.select('#score-graph'),
			WIDTH = 1000,
			HEIGHT = 500,
			MARGINS = {
				top: 20,
				right: 20,
				bottom: 20,
				left: 50
			},
			xRange = d3.time.scale()
								 .domain([new Date(scores[0].updated_at),
								 	new Date(scores[scores.length-1].updated_at)])
								 .rangeRound([MARGINS.left, WIDTH - MARGINS.right]),
			yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
																.domain(
																	[d3.min(scores, function(d) {
																		return 0;
																	}),
																	d3.max(scores, function(d) {
																		return d.value;
																	})]),
			xAxis = d3.svg.axis()
										.scale(xRange)
										.tickSize(5)
										.tickSubdivide(true),
			yAxis = d3.svg.axis()
										.scale(yRange)
										.tickSize(5)
										.orient('left')
										.tickSubdivide(true);

		vis.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
			.call(xAxis);

		vis.append('svg:g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
			.call(yAxis);

		var lineGenerator = d3.svg.line()
			.x(function(d) {
				console.log(d);
				var date = new Date(d.updated_at);
				return xRange(date);
			})
			.y(function(d) {
				return yRange(d.value);
			})
			.interpolate('linear');

		vis.append('svg:path')
			.attr('d', lineGenerator(scores))
			.attr('stroke', 'blue')
			.attr('stroke-width', 2)
			.attr('fill', 'none');
	} else {
		$('#score-container').prepend('<div>Play at least two games to view your progress!</div>');
	}
};