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



    const svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);
    const circleGroup = svg.append('g').classed('circles', true);
    const pathGroup = svg.append('g').classed('paths', true);

    const range = d3.scaleLinear().domain([0, 6]).ticks(7);
    console.log('range', range);

    const draw = (side, trans) => {

        const a = Math.sqrt(3);
        const u = buildHive(side).map(p => [p[0] * a, p[1] * a]);
        console.log('u', u);

        const circles = circleGroup.selectAll('circle').data(u, function (d, i) {
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


        const paths = pathGroup.selectAll('path').data(u, function (d, i) {
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
    const side = 13;
    draw(side, trans);

    document.querySelector('#transition').addEventListener('click', e => {
        console.log('click');
        trans = (trans === euclide) ? hyperbolic : euclide;
        console.log('trans', trans);
        draw(side, trans);
    });
})();