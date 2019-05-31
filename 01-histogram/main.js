(function () {

    const MAX_VALUE = 500000;

    const plot = (n) => {
        const histo = document.querySelector('#histo');

        const x = [];
        for (let i = 0; i < n; i++) {
            x[i] = Math.random();
        }

        const trace = {
            x: x,
            type: 'histogram',
            name: 'histogram about random function',
            opacity: 0.2,
            xbins: {
                start: 0,
                end: 1,
                size: 0.1,
            },
            marker: {
                color: 'hsla(240, 30%, 50%, 1)',
                line: {
                    width: 10,
                    color: 'white',
                }
            },
        };
        const data = [trace];
        const layout = {
            title: 'Random distribution',
            margin: { t: 150, l: 40, r: 40 },
            font: { size: 18 }
        };
        Plotly.newPlot(histo, data, layout, { responsive: true });

        document.querySelector('#samples').innerHTML = n;
    };



    const range = document.querySelector('input[type="range"]');
    const f = e => {
        const value = Math.round(Math.exp((Math.log(MAX_VALUE) / 100) * e.target.value));
        plot(value);
    };

    range.addEventListener('input', f);
    f({ target: range });
})();
