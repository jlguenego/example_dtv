(function () {

    Plotly.d3.csv('population-departement.csv', function (err, rows) {
        function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
        }

        var data = [{
            type: 'choropleth',
            name: 'Population française par département (2019)',
            locationmode: 'country names',
            locations: unpack(rows, 'location'),
            z: unpack(rows, 'alcohol'),
            text: unpack(rows, 'location'),
            autocolorscale: true
        }];

        var layout = {
            title: 'Pure alcohol consumption<br>among adults (age 15+) in 2010',
            geo: {
                projection: {
                    type: 'robinson'
                }
            }
        };

        Plotly.plot(document.querySelector('#choropleth'), data, layout, { showLink: false });

    });


})();
