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
        console.log('array', array);

        const hexagonArray = new Array(6).fill(0).reduce((acc, n, i) => {
            const a = rotateArray(array, i * Math.PI / 3);
            console.log('a', a);

            return acc.concat(a);
        }, []);
        console.log('hexagonArray', hexagonArray);
        return previous.concat(hexagonArray);
    };

    const side = 5;
    const u = buildU(side);
    console.log('u', u);

    const width = 20;
    const height = 20;

    const margin = ({ top: 0, right: 0, bottom: 0, left: 0 });

    const fx = t => Math.cos((2 * Math.PI / 6) * t);
    const fy = t => Math.sin((2 * Math.PI / 6) * t);

    const trans = d => 50 * d / (d + 1);



    // const f1 = d3.line()(t.ticks(14).map(t => [x(fx(t)), y(fy(t))]));
    // const f2 = d3.line()(t.ticks(14).map(t => [x(trans(fx(t))), y(trans(fy(t)))]));

    // let fn = f1;

    // const plot = svg => svg
    //     .append('path')
    //     .attr('d', fn);



    const svg = d3.select('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const circles = svg.append('g').classed('circles', true).selectAll('circle').data(u);
    circles.enter().append('circle')
        .attr('cx', d => d[0])
        .attr('cy', d => d[1])
        .attr('r', 0.1);

    const range = d3.scaleLinear().domain([0, 6]).ticks(7);
    console.log('range', range);

    const paths = svg.append('g').classed('paths', true).selectAll('path').data(u);
    paths.enter().append('path')
        .attr('d', d3.line()(range.map(t => [fx(t), fy(t)])));

    // const plots = svg.append('g').classed('plots', true);
    // plots.append('g').call(plot);



    // document.querySelector('#transition').addEventListener('click', e => {
    //     console.log('click');
    //     fn = (fn === f1) ? f2 : f1;
    //     plots.select('g').select('path')
    //         .transition().duration(2000)
    //         .attr('d', fn);
    // });
})();