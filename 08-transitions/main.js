(async function () {
    const scale = 2;

    const wikidataUrl = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';
    const request = `
    # The rivers which go to the Seine.
SELECT ?river ?riverLabel ?longueur ?superficie
WHERE 
{
    ?river wdt:P403 wd:Q1471;
            wdt:P2043 ?longueur;
            wdt:P2053 ?superficie.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY DESC(?superficie)
    `;

    const data = await d3.sparql(wikidataUrl, request);
    console.log('data', data);

    var t = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);

    const draw = data => {
        const root = d3.select('div.root');
        const dataElt = root.selectAll('div.items')
            .data(data, d => d, d => d.riverLabel);

        dataElt.exit().remove();

        dataElt
            .transition(t)
            .style("transform", (d, i) => `translate(0, ${i * scale}em)`);

        dataElt.enter()
            .append('div')
            .classed("item", true)
            .html(d => {
                console.log('adding');
                return `<div>${d.riverLabel}</div><div>${d.longueur}</div><div>${d.superficie}</div>`;
            })
            .transition(t)
            .style("transform", (d, i) => `translate(0, ${i * scale}em)`);


    };

    draw(data);

    document.getElementsByName('classement').forEach(input => {
        input.addEventListener('click', e => {
            console.log('e', e);
            const value = e.target.value;
            console.log('value', value);
            console.log('data', data);

            const newData = data.sort((a, b) => a[value] < b[value] ? 1 : -1);
            draw(newData);
        });

    });

})();