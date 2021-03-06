(function () {
    'use strict';

    const width = 500;
    const height = 500;

    const margin = ({ top: 10, right: 10, bottom: 10, left: 10 });

    const x = d3.scaleLinear()
        .domain([-11, 11])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([-1.1, 1.1])
        .range([height - margin.bottom, margin.top]);

    const xAxis = svg => svg
        .attr('transform', `translate(0,${margin.top + (height - margin.top - margin.bottom) / 2})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = svg => svg
        .attr('transform', `translate(${margin.left + (width - margin.left - margin.right) / 2},0)`)
        .call((...args) => console.log('args', args))
        .call(d3.axisLeft(y).tickSizeOuter(0));

    const f1 = d3.line()(x.ticks(1000).map(t => [x(t), y(0.01 * t ** 2)]));
    const f2 = d3.line()(x.ticks(1000).map(t => [x(t), y(Math.sin(t))]));

    let fn = f1;

    const plot = svg => svg
        .append('path')
        .attr('d', fn);



    const svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);

    const axes = svg.append('g').classed('axes', true);

    axes.append('g')
        .call(xAxis);

    axes.append('g')
        .call(yAxis);

    const plots = svg.append('g').classed('plots', true);
    plots.append('g').call(plot);



    document.querySelector('#transition').addEventListener('click', e => {
        console.log('click');
        fn = (fn === f1) ? f2 : f1;
        plots.select('g').select('path')
            .transition().duration(2000)
            .attr('d', fn);
    });
})();