(function () {

    const LIMIT_GLUCIDE = 10;
    const LIPID_SCALE = 30;

    const element = document.querySelector('#line-chart');

    function makeplot() {
        const csv = Plotly.d3.dsv(';', "text/plain");
        Plotly.d3.csv("ciqual-2017.csv", data => {
            const trace1 = makeTrace1(data);
            const trace2 = makeTrace2(data);
            makePlotly([trace1, trace2]);
        });
    };

    function makeTrace1(allRows) {

        console.log(allRows);
        const filteredData = allRows.filter(
            r => r.alim_ssgrp_code === '0201'
                && r.alim_ssssgrp_code === '020101'
                && +(r['Glucides (g/100g)'].replace(',', '.')) > LIMIT_GLUCIDE);
        const x = filteredData.map(r => +(r['Protéines (g/100g)'].replace(',', '.')));
        const y = filteredData.map(r => +(r['Glucides (g/100g)'].replace(',', '.')));

        const z = filteredData.map(r => +(r['Lipides (g/100g)'].replace(',', '.')));
        const names = filteredData.map((r, i) => r['alim_nom_fr'] + `[Lipides (g/100g) : ${z[i]}]`);

        console.log(x);
        console.log(y);
        console.log(z);

        const trace = {
            x,
            y,
            mode: 'markers',
            text: names,
            marker: {
                size: z.map(v => Math.sqrt(v)).map(v => LIPID_SCALE * v),
                // color: 'green',
            },
            name: 'Légumes crus',
        }
        return trace;
    }

    function makeTrace2(allRows) {

        console.log(allRows);
        const filteredData = allRows.filter(
            r => r.alim_ssgrp_code === '0201'
                && r.alim_ssssgrp_code === '020102'
                && +(r['Glucides (g/100g)'].replace(',', '.')) > LIMIT_GLUCIDE);
        const x = filteredData.map(r => +(r['Protéines (g/100g)'].replace(',', '.')));
        const y = filteredData.map(r => +(r['Glucides (g/100g)'].replace(',', '.')));

        const z = filteredData.map(r => +(r['Lipides (g/100g)'].replace(',', '.')));
        const names = filteredData.map((r, i) => r['alim_nom_fr'] + `[Lipides (g/100g) : ${z[i]}]`);

        console.log(x);
        console.log(y);
        console.log(z);

        const trace = {
            x,
            y,
            mode: 'markers',
            text: names,
            marker: {
                size: z.map(v => Math.sqrt(v)).map(v => LIPID_SCALE * v),
                color: 'red'
            },
            name: 'Légumes cuits',
        }
        return trace;
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
