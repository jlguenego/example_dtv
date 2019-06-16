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


    const color = x => {
        const array = new Array(10).fill(0).map((n, i) => `hsl(240, 100%, ${85 + 1.5 * i}%)`);
        const max = 20000;
        return array[Math.floor((x/max)*10)];
    };

    var t = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);

    const draw = data => {
        const root = d3.select('div.root');
        const dataElt = root.selectAll('div.item')
            .data(data, function (d) {
                return d.riverLabel;
            });

        dataElt.exit()
            .attr("class", "item exit")
            .transition(t)
            .style("color", d => {
                console.log('exit');
                return "red";
            })
            .remove();

        dataElt
            .attr("class", d => {
                console.log('update')
                return "item update";
            })
            .transition(t)
            .style("transform", (d, i) => `translate(0, ${i * scale}em)`);

        dataElt.enter()
            .append('div')
            .attr("class", "item enter")
            .html(d => {
                console.log('addingx');
                return `<span>${d.riverLabel}</span><span>${d.longueur}</span><span>${d.superficie}</span>`;
            })
            .style("background", d => {
                return color(+d.superficie);
            })
            .transition(t)
            .style("transform", (d, i) => `translate(0, ${i * scale}em)`);


    };

    draw(data.filter((d, i) => i < 10));

    document.getElementsByName('classement').forEach(input => {
        input.addEventListener('click', e => {
            const value = e.target.value;
            const newData = data
                .sort((a, b) => a[value] < b[value] ? 1 : (a[value] > b[value]) ? -1 : 0)
                .filter((d, i) => i < 10);
            draw(newData);
        });

    });

})();