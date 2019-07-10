(function () {
    'use strict';

    const width = 20;
    const height = 20;
    const margin = ({ top: 0, right: 0, bottom: 0, left: 0 });

    const x = d3.scaleLinear()
        .domain([-10, 10])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([-10, 10])
        .range([height - margin.bottom, margin.top]);

    const fx = t => Math.cos((2 * Math.PI / 6) * t + Math.PI / 6);
    const fy = t => Math.sin((2 * Math.PI / 6) * t + Math.PI / 6);

    const d3svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);
    const group = d3svg.append('g').classed('general', true);
    const circleGroup = group.append('g').classed('circles', true);
    const pathGroup = group.append('g').classed('paths', true);

    const range = d3.scaleLinear().domain([0, 6]).ticks(7);
    console.log('range', range);

    const a = Math.sqrt(3);
    const side = 13;
    const hive = buildHive(side).map(p => [p[0] * a, p[1] * a]);
    // console.log('hive', hive);

    const draw = (hive, trans) => {
        const circles = circleGroup.selectAll('circle').data(hive, function (d, i) {
            return i;
        });
        circles.exit().remove();
        circles.transition().duration(1000)
            .attr('cx', d => x(trans(d)[0]))
            .attr('cy', d => y(trans(d)[1]))
            .attr('r', 0.1);
        circles.enter().append('circle')
            .attr('cx', d => x(trans(d)[0]))
            .attr('cy', d => y(trans(d)[1]))
            .attr('r', 0.1);

        const paths = pathGroup.selectAll('path').data(hive, function (d, i) {
            return i;
        });
        paths.exit().remove();
        paths.transition().duration(1000)
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]])).map(p => [x(p[0]), y(p[1])])));
        paths.enter().append('path')
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]])).map(p => [x(p[0]), y(p[1])])));
    };

    const euclide = p => p;
    const hyperbolic = p => {
        const d = p.reduce((acc, x) => acc + x ** 2, 0) ** 0.5;
        const A = 2.9;
        const B = 1;
        const ratio = A / (d ** 0.95 + B);
        return p.map(x => x * A * ratio);
    };
    let trans = hyperbolic;

    draw(hive, trans);

    document.querySelector('#transition').addEventListener('click', e => {
        console.log('click');
        trans = (trans === euclide) ? hyperbolic : euclide;
        console.log('trans', trans);
        draw(hive, trans);
    });

    // d3 zoom
    d3svg.call(d3.zoom().on('zoom', zoomed));

    function zoomed(...args) {
        console.log('zoom', args, this, d3.event);
        group.attr('transform', d3.event.transform);
        
    }


})();