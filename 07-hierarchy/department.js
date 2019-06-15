var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var format = d3.format(",d");

var treemap = d3.treemap()
    .size([width, height])
    .round(true)
    .padding(1);

d3.csv("department.sparql.txt.csv", d => {
    console.log('d', d);
    return {
        id: `${d.depLabel} [${d.numero}]`,
        size: +d.population,
        parent: d.regionLabel
    };
}, function (error, data) {
    if (error) throw error;

    const regions = data.reduce((acc, n) => acc.add(n.parent), new Set());
    console.log('regions', regions);
    data = [...regions].map(r => ({ id: `${r}`, parent: 'France' })).concat(data);
    data.push({ id: 'France' });

    var root = d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parent)
        (data)
        .sum(d => d.size)
        .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

    console.log('root', root);

    treemap(root);

    var cell = svg.selectAll("a")
        .data(root.leaves())
        .enter().append("a")
        .attr("target", "_blank")
        .attr("xlink:href", d => `https://fr.wikipedia.org/wiki/${encodeURIComponent(d.id.replace(/ \[.*\]/, ''))}`)
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
        .attr("id", d => d.id)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => {
            const a = d.ancestors();
            return color(a[a.length - 2].id);
        });

    cell.append("clipPath")
        .attr("id", function (d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function (d) { return `"#" + d.id`; });

    var label = cell.append("text")
        .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; });

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 13)
        .text(function (d) { 
            console.log('d', d);
            return d.data.id; });

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 25)
        .text(function (d) { return format(d.value); });

    cell.append("title")
        .text(d => `https://fr.wikipedia.org/wiki/${encodeURIComponent(d.id.replace(/ \[.*\]/, ''))}`);
});
