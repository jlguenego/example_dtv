(function () {
    'use strict';

    const width = 500;
    const height = 500;

    const margin = ({ top: 20, right: 30, bottom: 30, left: 40 });

    const x = d3.scaleLinear()
        .domain([-1, 1])
        .range([margin.left, width - margin.right]);
    console.log('x', x.toString());

    const y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height - margin.bottom, margin.top]);

    const xAxis = svg => svg
        .attr('transform', `translate(0,${margin.top + (height - margin.top - margin.bottom) / 2})`)
        .call(d3.axisBottom(x));

    const yAxis = svg => svg
        .attr('transform', `translate(${margin.left + (width - margin.left - margin.right) / 2},0)`)
        .call((...args) => console.log('args', args))
        .call(d3.axisLeft(y));



    const svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);

    svg.append('g')
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    return svg.node();
})();