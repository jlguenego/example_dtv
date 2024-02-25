// @ts-nocheck

// code inspired by https://observablehq.com/@d3/zoomable-circle-packing

const data = {
  name: "top",
  children: [
    {
      name: "",
      children: new Array(1000).fill(0).map(() => ({
        name: "x",
        value: 20 + 100 * Math.random(),
        color: Math.random() < 0.95 ? "#0bf" : "#f08",
      })),
    },
  ],
};

const buildSVG = () => {
  // Specify the chart’s dimensions.
  const width = 500;
  const height = width;

  // Compute the layout.
  const pack = (data) =>
    d3.pack().size([width, height]).padding(3)(
      d3.hierarchy(data).sum((d) => d.value)
      // .sort((a, b) => b.value - a.value)
    );
  const root = pack(data);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr(
      "style",
      `max-width: 100%; height: auto; display: block; margin: 0 -14px;`
    );

  // Append the nodes.
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr("fill", (d) => {
      return d.children ? "white" : d.data.color;
    });

  // Create the zoom behavior and zoom immediately in to the initial focus node.
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];
    view = v;
    node.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr("r", (d) => d.r * k);
  }
  return svg.node();
};

const node = buildSVG();
document.querySelector("div.diagram").append(node);
