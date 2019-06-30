(async function () {
    'use strict';

    const entity = 'Q7758';

    const getEntity = s => s.substr('http://www.wikidata.org/entity/'.length);

    async function queryData() {
        const query = `
SELECT DISTINCT ?h ?hLabel ?hDescription ?parent ?parentLabel
WHERE
{
    wd:${entity} wdt:P40+ ?h.
    ?parent wdt:P40 ?h.
    wd:${entity} wdt:P40* ?parent.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
`;

        const endpoint = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=${encodeURIComponent(query)}`;
        const response = await fetch(endpoint);
        const json = await response.json();
        console.log('json', json);
        return json;
    }

    function makeTree(json) {
        const row = json.results.bindings.find(d => {
            console.log('d', d);
            return getEntity(d.parent.value) === entity;
        });
        return subTree(json, { hLabel: { value: row.parentLabel.value }, h: { value: row.parent.value } }, 0);
    }

    function subTree(json, parentRow, level) {
        const result = {};
        result.name = parentRow.hLabel.value;
        result.level = level;
        result.children = json.results.bindings.filter(d => d.parent.value === parentRow.h.value).map(d => {
            return subTree(json, d, level + 1);
        });
        return result;
    }

    function draw(data) {
        const width = 1200;
        const height = 1200;
        const radius = 450;
        const tree = data => d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
            (d3.hierarchy(data));

        const root = tree(data);

        const svg = d3.select('div#diagram').append('svg')
            .attr('viewBox', [-width / 2, -height / 2, width, height])
            .style('font', '5px sans-serif');

        const link = svg.append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        const node = svg.append('g')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 3)
            .selectAll('g')
            .data(root.descendants().reverse())
            .join('g')
            .attr('transform', d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

        node.append('circle')
            .attr('fill', d => d.children ? '#555' : '#999')
            .attr('r', 2.5);

        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
            .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
            .text(d => d.data.name)
            .clone(true).lower()
            .attr('stroke', 'white');

    }



    const json = await queryData();
    const tree = makeTree(json, entity);
    console.log('tree', tree);
    draw(tree);
})();