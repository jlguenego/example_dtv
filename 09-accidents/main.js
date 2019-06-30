(async function () {
    'use strict';

    const map = L.map('mapid').setView([46.9, 1], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const csvData = await d3.csv('./caracteristiques-2017.csv');
    // const data = csvData.filter(d => d.mois === '1' && d.jour === '5');
    const data = csvData.filter(d => d.mois === '1');
    // const data = csvData;

    const svg = L.svg();
    map.addLayer(svg);
    const g = d3.select(svg._rootGroup).classed('d3-overlay', true);

    data.forEach(d => d.LatLng = new L.LatLng(+d.lat / 100000, +d.long / 100000));
    console.log('data', data);
    const feature = g.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .style('stroke', 'black')
        .style('opacity', .6)
        .style('fill', 'red')
        .attr('r', 5);

    map.on('zoomend', function() {
        update();
    });
    update();

    function update() {
        console.log('update');
        feature.attr('transform',
            function (d) {
                return 'translate(' +
                    map.latLngToLayerPoint(d.LatLng).x + ',' +
                    map.latLngToLayerPoint(d.LatLng).y + ')';
            }
        );
    }

})();

