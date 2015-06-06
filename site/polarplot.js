var deg2rad = Math.PI / 180;

window.polarplot = function (container) {

	var width = 600,
		height = 600,
		radius = Math.min(width, height) / 2 - 30;

	var r = d3.scale.linear().domain([0, 10]).range([0, radius]);

	var svg = d3.select(container).append('svg')
		.attr({width: width, height: height})
	  .append('g')
		.attr('transform', 'translate(' + 10 + ',' + height / 2 + ')');

	var gr = svg.append('g')
		.attr('class', 'r axis')
	  .selectAll('g')
		.data(r.ticks(5).slice(1))
	  .enter().append('g');

	gr.append('circle').attr('r', r);

	gr.append('text')
		.attr('y', function(d) { return -r(d) - 4; })
		.attr('transform', 'rotate(15)')
		.style('text-anchor', 'middle')
		.text(function(d) { return d + 'kts'; });


	var graph = svg.append('g')
		.attr('class', 'a axis')
	  .selectAll('g')
		.data([0, 52, 60, 75, 90, 110, 120, 135, 150].map(function (d) { return d - 90; }))
	  .enter().append('g')
		.attr('transform', function(d) { return 'rotate(' + d + ')'; });

	graph.append('line')
		.attr('x2', radius);

	graph.append('text')
		.attr('x', radius + 6)
		.attr('dy', '.35em')
		.style('text-anchor', function(d) { return d < 270 && d > 90 ? 'end' : null; })
		.attr('transform', function(d) { return d < 270 && d > 90 ? 'rotate(180 ' + (radius + 6) + ', 0)' : null; })
		.text(function(d) { return (d + 90) + '°'; });
	var plot = function () {};

	var line = d3.svg.line.radial()
		.radius(function(d) { return r(d[1]); })
		.angle(function(d) { return d[0]; });

	var meta = d3.select('#meta').append('div')
		.attr('class', 'meta')
		.attr('transform', 'translate(' + (width / 2 - 200) + ',' + ((height / 2) - 40) + ')');

	plot.render = function (data) {
		var vpp_angles = data.vpp.angles.map(function (d) { return d * deg2rad; });

		var vpp_data = [6, 8, 10, 12, 14, 16, 20].map(function (windspeed) {
			return d3.zip(vpp_angles, data.vpp[windspeed]);
		});
		var lines = svg.selectAll('.line').data(vpp_data);

		lines.enter().append('path').attr('class', 'line');

		lines.transition().duration(200).attr('d', line);
		lines.exit().remove();

		meta.selectAll('.meta-item')
			.data([
				'<span class="sailnumber">' + data.sailnumber + '</span>',
				'<h2>' + data.name + '</h2>',
				data.boat.type
			]).enter().append('span').attr('class', 'meta-item');

		meta.selectAll('.meta-item').html(function (d) { return d; });
	};

	return plot;
};