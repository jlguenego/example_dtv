var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var format = d3.format(",d");

var treemap = d3.treemap()
    .size([width, height])
    .round(true)
    .padding(1);

d3.csv("fromage_francais.sparql.txt.csv", function (error, data) {
    if (error) throw error;
    console.log('data', data);
    const types = [...data.reduce((acc, n) => acc.add(n.typeLabel), new Set())].sort();
    console.log('types', types);
    const fromages = [...data.reduce((acc, n) => acc.add(n.fromageLabel), new Set())].sort();
    console.log('fromages', fromages);

    const fromageText = svg.selectAll("text.fromageText")
        .data(fromages)
        .enter().append("text")
        .attr("x", 300)
        .attr("y", (d, i) => i * 20 + 370)
        .attr("fill", "red")
        .attr("text-anchor", "end")
        .text(d => d);

    const typeText = svg.selectAll("text.typeText")
        .data(types)
        .enter().append("text")
        .attr("fill", "blue")
        .attr("transform", (d, i) => `translate(${i * 20 + 320}, 350) rotate(-90)`)
        .attr("text-anchor", "start")
        .text(d => d);

    const circle = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("fill", "black")
        .attr("r", 5)
        .attr("transform", (d, i) => {
            const x = types.indexOf(d.typeLabel);
            const y = fromages.indexOf(d.fromageLabel);
            return `translate(${x * 20 + 315}, ${y * 20 + 363})`;
        })
        .on("mouseover", function (d, i) {
            console.log('this', this);
            const circle = d3.select(this)
                .attr("fill", "orange")
                .attr("r", 10);
            console.log('circle', circle);

            svg.append("text")
                .attr("id", "text_to_print")
                .attr("fill", "green")
                .attr("transform", () => {
                    console.log('d', d);
                    const x = types.indexOf(d.typeLabel);
                    const y = fromages.indexOf(d.fromageLabel);
                    return `translate(${x * 20 + 325}, ${y * 20 + 363})`;
                })
                .text(d.typeLabel);
        })
        .on("mouseout", function (d, i) {
            console.log('this', this);
            const circle = d3.select(this)
                .attr("fill", "black")
                .attr("r", 5);
            d3.select("#text_to_print").remove();
        });


});
