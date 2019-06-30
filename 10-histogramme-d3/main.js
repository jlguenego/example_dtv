(async function () {
    'use strict';

    const day = moment.weekdays().map(s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase());

    function draw(data) {
        const scale = 100 / 10000;
        const histo = d3.select('#histo').selectAll('div.bar').data(data);

        histo.enter().append('div').classed('bar', true)
            .html((d, i) => `<span>${day[i]}</span>`)
            .style('width', '0%');

        histo.html((d, i) => `<span>${day[i]}</span><span>${d}</span>`)
            .transition()
            .duration(2000)
            .ease(d3.easeSin)
            .style('width', d => Math.floor(d * scale) + '%')
            .style('background-color', d => `hsl(240, 30%, ${100 - d * scale / 2}%)`);
    }

    async function buildData() {
        const pad = (a, b) => (1e15 + a + '').slice(-b);
        const data = await d3.csv('../09-accidents/caracteristiques-2017.csv');
        const groupby = data.reduce((acc, d) => {
            const date = moment(`20${d.an}-${pad(d.mois, 2)}-${pad(d.jour, 2)}`);
            const weekDay = date.day();
            acc[weekDay]++;
            return acc;
        }, new Array(7).fill(0));
        return groupby;
    }

    draw(new Array(7).fill(0));
    const data = await buildData();
    draw(data);

})();