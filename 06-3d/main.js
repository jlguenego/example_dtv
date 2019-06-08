(function () {

    const element = document.querySelector('#x3d-bubble-chart');
    const config = ['légumes crus', 'fruits crus'];

    function main() {
        Plotly.d3.csv("../data/ciqual-2017.csv", data => {
            // get the different subgroup
            const subgroup = getSubGroup(data);
            const aside = document.querySelector('aside');
            const html = Object.keys(subgroup).sort().map(n => `<label><input type="checkbox" name="${subgroup[n]}">${n}</label>`).join('');
            console.log('html', html);
            aside.innerHTML = html;
            addEvent(subgroup);
            applyConfig(config, subgroup);
        });
    };

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
