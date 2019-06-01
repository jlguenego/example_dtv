(function () {

    const element = document.querySelector('#line-chart');

    function makeplot() {
        const csv = Plotly.d3.dsv(';', "text/plain");
        Plotly.d3.csv("ciqual-2017.csv", data => {
            const traces = makeTraces(data);
            makePlotly(traces);
        });
    };

    function makeTraces(allRows) {

        console.log(allRows);
        const filteredData = allRows.filter(
            r => r.alim_ssgrp_code === '0201' 
            && r.alim_ssssgrp_code === '020101' 
            && +(r['Glucides (g/100g)'].replace(',', '.')) < 5);
        const x = filteredData.map(r => +(r['Protéines (g/100g)'].replace(',', '.')));
        const y = filteredData.map(r => +(r['Glucides (g/100g)'].replace(',', '.')));
            
        const z = filteredData.map(r => +(r['Lipides (g/100g)'].replace(',', '.')));
        const names = filteredData.map((r, i) => r['alim_nom_fr'] + `[Lipides (g/100g) : ${z[i]}]`);

        console.log(x);
        console.log(y);
        console.log(z);

        const traces = [{
            x,
            y,
            mode: 'markers',
            text: names,
            marker: {
                size: z.map(v => Math.sqrt(v)).map(v => 30 * v)
            }
        }];
        return traces;
    }

    function makePlotly(traces) {
        const layout = {
            title: 'Nutritional facts',
            xaxis: {
                title: 'Protéines (g/100g)',
            },
            yaxis: {
                title: 'Glucides (g/100g)',
            },

        };
        Plotly.newPlot(element, traces, layout, { responsive: true });
    };
    makeplot();


})();
