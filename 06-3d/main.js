(function () {

    const element = document.querySelector('#x3d-bubble-chart');
    const config = ['légumes crus', 'fruits crus'];

    function main() {
        Plotly.d3.csv("../data/ciqual-2017.csv", data => {
            // get the different subgroup
            const subgroup = getSubGroup(data);
            const aside = document.querySelector('aside');
            const html = Object.keys(subgroup).map(n => `<label><input type="checkbox" name="${n}">${subgroup[n]}</label>`).join('');
            console.log('html', html);
            aside.innerHTML = html;
            addEvent(subgroup);
        });
    };

    const getSubGroup = data => {
        console.log('data', data);
        const subgroup = data.reduce((acc, n) => {
            if (n.alim_ssssgrp_nom_fr.length < 2) {
                return acc;
            }
            acc[n.alim_ssssgrp_code] = n.alim_ssssgrp_nom_fr;
            return acc;
        }, {});
        console.log('subgroup', subgroup);
        return subgroup;
    }

    const addEvent = subgroup => {
        Object.keys(subgroup).forEach(n => {
            document.querySelector(`input[name="${n}"]`).addEventListener('input', e => {
                console.log('e', e);
                if (e.target.checked) {
                    show(e.target.name);
                } else {
                    hide(e.target.name);
                }
            });
        });
    }

    const show = code => {
        console.log('show code', code);
    }
    const hide = code => {
        console.log('hide code', code);
    }


    main();


})();
