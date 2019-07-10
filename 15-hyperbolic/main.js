(function () {
    'use strict';

    const rotate = (point, angle) => {
        return [
            point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
            point[0] * Math.sin(angle) + point[1] * Math.cos(angle)
        ];
    };

    const rotateArray = (array, angle) => new Array(array.length).fill(0).map((n, i) => rotate(array[i], angle));

    const buildU = side => {

        if (side === 0) {
            return [[0, 0]];
        }

        const previous = buildU(side - 1);
        // now add the point around the previous array.
        const length = 6 * side;
        const array = new Array(side).fill(0).map((n, i) => [side - i / 2, i * Math.sqrt(3) / 2]);

        const hexagonArray = new Array(6).fill(0).reduce((acc, n, i) => {
            const a = rotateArray(array, i * Math.PI / 3);
            return acc.concat(a);
        }, []);
        return previous.concat(hexagonArray);
    };

    const width = 20;
    const height = 20;

    const margin = ({ top: 0, right: 0, bottom: 0, left: 0 });

    const fx = t => Math.cos((2 * Math.PI / 6) * t + Math.PI / 6);
    const fy = t => Math.sin((2 * Math.PI / 6) * t + Math.PI / 6);



    const svg = d3.select('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);
    const circleGroup = svg.append('g').classed('circles', true);
    const pathGroup = svg.append('g').classed('paths', true);

    const range = d3.scaleLinear().domain([0, 6]).ticks(7);
    console.log('range', range);

    const draw = (side, trans) => {

        const a = Math.sqrt(3);
        const u = buildU(side).map(p => [p[0] * a, p[1] * a]);
        console.log('u', u);

        // const circles = circleGroup.selectAll('circle').data(u, function (d, i) {
        //     return i;
        // });
        // circles.exit().remove();
        // circles
        //     .attr('cx', d => trans(d[0]))
        //     .attr('cy', d => trans(d[1]))
        //     .attr('r', 0.1);
        // circles.enter().append('circle')
        //     .attr('cx', d => trans(d[0]))
        //     .attr('cy', d => trans(d[1]))
        //     .attr('r', 0.1);


        const paths = pathGroup.selectAll('path').data(u, function (d, i) {
            return i;
        });
        paths.exit().remove();
        paths
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]]))));
        paths.enter().append('path')
            .attr('d', d => d3.line()(range.map(t => trans([fx(t) + d[0], fy(t) + d[1]]))));

    };

    const euclide = p => p;
    const hyperbolic = p => {
        const d = p.reduce((acc, x) => acc + x ** 2, 0)**0.5;
        const A = 2.5;
        const B = 1;
        const ratio = A/(d**0.95+B);
        return p.map(x => x * A * ratio);
    };
    let trans = hyperbolic;
    const side = 10;
    draw(side, trans);

    document.querySelector('#transition').addEventListener('click', e => {
        console.log('click');
        trans = (trans === euclide) ? hyperbolic : euclide;
        console.log('trans', trans);
        draw(side, trans);
    });
})();