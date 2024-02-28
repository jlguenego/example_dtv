// @ts-nocheck

(async () => {
  const freedom = await d3.csv(
    "https://gist.githubusercontent.com/will-r-chase/16827fa79e02af9e3a0651fb0d79b426/raw/92b321a8bc4d98e463156ef03a5da5cf05065704/freedom_clean.csv",
    d3.autoType
  );

  const freedom_year = freedom.filter((obj) => {
    return obj.year === 2008;
  });

  const freedom_nest = d3
    .nest()
    .key((d) => d.region_simple)
    .entries(freedom_year);

  const data_nested = { key: "freedom_nest", values: freedom_nest };

  const population_hierarchy = d3
    .hierarchy(data_nested, (d) => d.values)
    .sum((d) => d.population);

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const width = 750 - margin.left - margin.right;
  const height = 750 - margin.top - margin.bottom;

  const bigFormat = d3.format(",.0f");

  const regionColor = function (region) {
    var colors = {
      "Middle East and Africa": "#596F7E",
      Americas: "#168B98",
      Asia: "#ED5B67",
      Oceania: "#fd8f24",
      Europe: "#919c4c",
    };
    return colors[region];
  };

  function colorHierarchy(hierarchy) {
    if (hierarchy.depth === 0) {
      hierarchy.color = "black";
    } else if (hierarchy.depth === 1) {
      hierarchy.color = regionColor(hierarchy.data.key);
    } else {
      hierarchy.color = hierarchy.parent.color;
    }
    if (hierarchy.children) {
      hierarchy.children.forEach((child) => colorHierarchy(child));
    }
  }

  const buildSVG = () => {
    const svg = d3
      .select("div.diagram")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.left + margin.right);

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("fill", "#F5F5F2");
    const voronoi = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const labels = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const pop_labels = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let seed = new Math.seedrandom(20);

    const ellipse = d3
      .range(100)
      .map((i) => [
        (width * (1 + 0.99 * Math.cos((i / 50) * Math.PI))) / 2,
        (height * (1 + 0.99 * Math.sin((i / 50) * Math.PI))) / 2,
      ]);

    let voronoiTreeMap = d3.voronoiTreemap().prng(seed).clip(ellipse);

    voronoiTreeMap(population_hierarchy);
    colorHierarchy(population_hierarchy);

    let allNodes = population_hierarchy
      .descendants()
      .sort((a, b) => b.depth - a.depth)
      .map((d, i) => Object.assign({}, d, { id: i }));

    let hoveredShape = null;
    //return allNodes;

    voronoi
      .selectAll("path")
      .data(allNodes)
      .enter()
      .append("path")
      .attr("d", (d) => "M" + d.polygon.join("L") + "Z")
      .style("fill", (d) => (d.parent ? d.parent.color : d.color))
      .attr("stroke", "#F5F5F2")
      .attr("stroke-width", 0)
      .style("fill-opacity", (d) => (d.depth === 2 ? 1 : 0))
      .attr("pointer-events", (d) => (d.depth === 2 ? "all" : "none"))
      .on("mouseenter", (d) => {
        let label = labels.select(`.label-${d.id}`);
        label.attr("opacity", 1);
        let pop_label = pop_labels.select(`.label-${d.id}`);
        pop_label.attr("opacity", 1);
      })
      .on("mouseleave", (d) => {
        let label = labels.select(`.label-${d.id}`);
        label.attr("opacity", (d) => (d.data.population > 130000000 ? 1 : 0));
        let pop_label = pop_labels.select(`.label-${d.id}`);
        pop_label.attr("opacity", (d) =>
          d.data.population > 130000000 ? 1 : 0
        );
      })
      .transition()
      .duration(1000)
      .attr("stroke-width", (d) => 7 - d.depth * 2.8)
      .style("fill", (d) => d.color);

    labels
      .selectAll("text")
      .data(allNodes.filter((d) => d.depth === 2))
      .enter()
      .append("text")
      .attr("class", (d) => `label-${d.id}`)
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        (d) => "translate(" + [d.polygon.site.x, d.polygon.site.y + 6] + ")"
      )
      .text((d) => d.data.key || d.data.countries)
      //.attr('opacity', d => d.data.key === hoveredShape ? 1 : 0)
      .attr("opacity", function (d) {
        if (d.data.key === hoveredShape) {
          return 1;
        } else if (d.data.population > 130000000) {
          return 1;
        } else {
          return 0;
        }
      })

      .attr("cursor", "default")
      .attr("pointer-events", "none")
      .attr("fill", "black")
      .style("font-family", "Montserrat");

    pop_labels
      .selectAll("text")
      .data(allNodes.filter((d) => d.depth === 2))
      .enter()
      .append("text")
      .attr("class", (d) => `label-${d.id}`)
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        (d) => "translate(" + [d.polygon.site.x, d.polygon.site.y + 25] + ")"
      )
      .text((d) => bigFormat(d.data.population))
      //.attr('opacity', d => d.data.key === hoveredShape ? 1 : 0)
      .attr("opacity", function (d) {
        if (d.data.key === hoveredShape) {
          return 1;
        } else if (d.data.population > 130000000) {
          return 1;
        } else {
          return 0;
        }
      })

      .attr("cursor", "default")
      .attr("pointer-events", "none")
      .attr("fill", "black")
      .style("font-size", "12px")
      .style("font-family", "Montserrat");
  };

  buildSVG();
})();
