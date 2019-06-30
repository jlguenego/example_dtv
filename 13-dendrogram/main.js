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
        const width = 900;
        const tree = data => {
            const root = d3.hierarchy(data)
                .sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name));
            root.dx = 7;
            root.dy = width / (root.height + 5);
            return d3.cluster().nodeSize([root.dx, root.dy])(root);
        };
        const root = tree(data);

        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const svg = d3.select('div#diagram').append('svg')
            .attr('viewBox', [-35, 0, width, x1 - x0 + root.dx * 2]);

        const g = svg.append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 7)
            .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`);

        const link = g.append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `);

        const node = g.append('g')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 3)
            .selectAll('g')
            .data(root.descendants().reverse())
            .join('g')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('fill', d => d.children ? '#555' : '#999')
            .attr('r', 2.5);

        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d.children ? -6 : 6)
            .text(d => d.data.name)
            .filter(d => d.children)
            .attr('text-anchor', 'end')
            .clone(true).lower()
            .attr('stroke', 'white');

    }



    const json = await queryData();
    const tree = makeTree(json, entity);
    console.log('tree', tree);
    draw(tree);
})();