(async function () {
    'use strict';

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



    const data = await buildData();
    console.log('data', data);

    const day = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];



    const histo = d3.select('#histo');
    console.log('histo', histo);
    const scale = 100 / 10000;
    histo.selectAll('div.bar').data(data).enter().append('div').classed('bar', true)
        .style('width', d => Math.floor(d * scale) + '%')
        .html((d, i) => `<span>${day[i]}</span><span>${d}</span>`);

})();