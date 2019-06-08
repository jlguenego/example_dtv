(function () {

    
    const config = ['légumes crus', 'fruits crus'];

    function main() {
        Plotly.d3.csv("../data/ciqual-2017.csv", data => {
            // get the different subgroup
            const subgroup = getSubGroup(data);
            drawAside(subgroup);
            addEvent(subgroup);
            applyConfig(config, subgroup);
            drawBubbles(data, config);
        });
    };

    String.prototype.hashCode = function () {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    const convertToNum = str => str.replace(/,/, '.').replace(/ /g, '');

    const getColor = (str) => {
        return `hsl(${str.hashCode() % 360}, 100%, 50%)`;
    };

    const unpack = (rows, key) => {
        return rows.map(row => convertToNum(row[key]));
    };

    const drawBubbles = (data, config) => {
        const traces = config.map(n => {
            const rows = data.filter(d => d.alim_ssssgrp_nom_fr === n);
            const trace = {
                type: 'scatter3d',
                x: unpack(rows, 'Protéines (g/100g)'),
                y: unpack(rows, 'Glucides (g/100g)'),
                z: unpack(rows, 'Lipides (g/100g)'),
                text: rows.map(r => r.alim_nom_fr),
                mode: 'markers',
                marker: {
                    size: 12,
                    line: {
                        color: getColor(n),
                        width: 0.5
                    },
                    opacity: 0.8
                },
                name: n,
            };
            return trace;
        });
        const layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 50
            }
        };
        const element = document.querySelector('section');
        Plotly.newPlot(element, traces, layout);
    };

    const drawAside = (subgroup) => {
        const aside = document.querySelector('aside');
        const html = Object.keys(subgroup).sort().map(n => `<label><input type="checkbox" name="${subgroup[n]}">${n}</label>`).join('');
        console.log('html', html);
        aside.innerHTML = html;
    }

    const getSubGroup = data => {
        console.log('data', data);
        const subgroup = data.reduce((acc, n) => {
            if (n.alim_ssssgrp_nom_fr.length < 2) {
                return acc;
            }
            acc[n.alim_ssssgrp_nom_fr] = n.alim_ssssgrp_code;
            return acc;
        }, {});
        console.log('subgroup', subgroup);
        return subgroup;
    }

    const addEvent = subgroup => {
        Object.keys(subgroup).forEach(n => {
            document.querySelector(`input[name="${subgroup[n]}"]`).addEventListener('input', e => {
                console.log('e', e);
                if (e.target.checked) {
                    show(e.target.name);
                } else {
                    hide(e.target.name);
                }
            });
        });
    };

    const applyConfig = (config, subgroup) => {
        config.forEach(n => {
            console.log('n', n);
            console.log('n', subgroup[n]);
            const input = document.querySelector(`input[name="${subgroup[n]}"]`);
            input.checked = true;
        });
    };

    const show = code => {
        console.log('show code', code);
    }
    const hide = code => {
        console.log('hide code', code);
    }


    main();


})();
