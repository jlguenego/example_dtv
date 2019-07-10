(function () {
    'use strict';

    const width = 40;
    const height = 40;
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

    const draw = (hive, trans, duration) => {
        const circles = circleGroup.selectAll('circle').data(hive, function (d, i) {
            return i;
        });
        circles.exit().remove();
        circles.transition().duration(duration)
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
        paths.transition().duration(duration)
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]])).map(p => [x(p[0]), y(p[1])])));
        paths.enter().append('path')
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]])).map(p => [x(p[0]), y(p[1])])));
    };

    const A = 8.5;
    const B = 1;
    const C = 1;

    const euclide = p => p;
    const hyperbolic = p => {
        const d = p.reduce((acc, x) => acc + x ** 2, 0) ** 0.5;
        const D = A / (d ** C + B);
        return p.map(x => x * D);
    };
    const hyperbolicInverted = p => {
        const D = p.reduce((acc, x) => acc + x ** 2, 0) ** 0.5;
        const d = ((- B) / (D - A));
        return p.map(x => x * d);
    };

    let trans = hyperbolic;

    draw(hive, trans, 0);

    document.querySelector('#transition').addEventListener('click', e => {
        console.log('click');
        trans = (trans === euclide) ? hyperbolic : euclide;
        console.log('trans', trans);
        draw(hive, trans, 1000);
    });

    d3svg.on('click', clicked);

    function clicked(...args) {
        console.log('clicked', args, d3.event);
        const svg = document.querySelector('svg');
        const pt = svg.createSVGPoint();
        function cursorPoint(evt) {
            pt.x = evt.clientX; pt.y = evt.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        }
        const loc = cursorPoint(d3.event);
        console.log('loc', loc);
        const transInverted = (trans === euclide) ? euclide : hyperbolicInverted;
        const point = transInverted([x.invert(loc.x), y.invert(loc.y)]);
        console.log('point', point);
        hive.forEach(p => {
            p[0] -= point[0];
            p[1] -= point[1];
        });
        draw(hive, trans, 300);
    }



})();