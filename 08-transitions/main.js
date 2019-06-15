(async function () {
    console.log('starting');
    console.log('d3', d3);


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

    const root = d3.select('div.root');
    const item = root.selectAll('div.items')
        .data(['hello', 'coucou', 'titi'])
        .enter()
        .append('div')
        .classed("item", true)
        .text(d => d)
        .style("transform", (d, i) => `translate(0, ${i * scale}em)`);
})();