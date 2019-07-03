(function () {

    const element = document.querySelector('#line-chart');

    function makeplot() {
        const csv = Plotly.d3.dsv(';', "text/plain");
        csv("../02-scatter/77468_000AE.csv", data => {
            const traces = makeTraces(data);
            makePlotly(traces);
        });
    };

    function makeTraces(allRows) {

        console.log(allRows);
        const filteredData = allRows.filter(r => +r.valeur_fonciere > 1000 && +r.lot1_surface_carrez > 10);
        const years = filteredData.map(r => +r.id_mutation.substr(0, 4));
        const x = [...new Set(years)].sort();
        const y = x.map(year => filteredData
            .filter(r => +r.id_mutation.substr(0, 4) === year)
            .map(r => (+r.valeur_fonciere) / (+r.lot1_surface_carrez))
            .reduce((acc, n, i, array) => acc + n / array.length, 0)
        );
        const z = x.map(year => filteredData
            .filter(r => +r.id_mutation.substr(0, 4) === year).length

        );
        console.log(x);
        console.log(y);
        console.log(z);

        const traces = [
            { x, y: y, mode: 'lines', name: 'prix moyen m²' },
            { x, y: z, mode: 'lines+markers', name: 'nombre de transactions', yaxis: 'y2' }
        ];
        return traces;
    }

    function makePlotly(traces) {
        const layout = {
            title: 'Prix du m² à Torcy (Cadastre AE)',
            xaxis: {
                title: 'année',
                dtick: 1,
            },
            yaxis: {
                title: 'prix moyen du m²',
            },
            yaxis2: {
                title: 'nombre de transactions',
                overlaying: 'y',
                scaleanchor: 'y',
                scaleratio: 50,
                side: 'right',
                color: 'red',
                showgrid: true,
                gridcolor: 'hsla(0, 0%, 98%, 1)',
            }
        };
        Plotly.newPlot(element, traces, layout, { responsive: true });
    };
    makeplot();


})();
