(function () {

    // inspired by https://bl.ocks.org/bricedev/97c53d6ed168902239f7

    var width = 960,
        height = 700,
        formatNumber = d3.format("s");

    const populationBins = [250000, 500000, 750000, 1000000, 1250000, 1500000, 2000000, 3000000];
    const colorBins = populationBins.map(n => `hsl(240, 30%, ${100 - n * 100 / 3000000}%)`)

    var color = d3.scale.threshold()
        .domain(populationBins)
        .range(["#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    var x = d3.scale.linear()
        .domain([77156, 2579208])
        .range([0, 300]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(13)
        .tickValues(color.domain())
        .tickFormat(function (d) { return formatNumber(d); });

    var projection = d3.geo.albers()
        .center([0, 49.5])
        .rotate([-2.8, 3])
        .parallels([45, 55])
        .scale(3800)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select('body').append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(" + 40 + "," + 40 + ")");

    g.selectAll("rect")
        .data(color.range().map(function (currentColor) {
            var d = color.invertExtent(currentColor);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function (d) { return x(d[0]); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .style("fill", function (d) { return color(d[0]); });

    g.call(xAxis).append("text")
        .attr("class", "caption")
        .attr("y", -6)
        .text("Population");

    queue()
        .defer(d3.json, "departements.json")
        .defer(d3.csv, "population-departement.csv")
        .await(ready);

    function ready(error, france, population) {

        var regions = svg.selectAll(".departements")
            .data(france.features)
            .enter().append("path")
            .attr("class", "departements")
            .attr("d", path)
            .style("fill", function (departement) {
                var paringData = population.filter(function (population) { return departement.properties.code === population.numero; })[0];
                return paringData ? color(paringData.population.replace(/,/g, '')) : color(0);
            })
            .on("mouseover", function (d) {
                var paringData = population.filter(function (population) { return d.properties.code === population.numero; })[0];
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.properties.nom} (${d.properties.code}): ${paringData.population.replace(/,/g, ' ')}`)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    };


})();
