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

    const drag = simulation => {

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    function draw(data) {
        const width = 600;
        const height = 600;
        const root = d3.hierarchy(data);
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(0).strength(1))
            .force('charge', d3.forceManyBody().strength(-50))
            .force('x', d3.forceX())
            .force('y', d3.forceY());

        const svg = d3.select('div#diagram').append('svg')
            .attr('viewBox', [-width / 2, -height / 2, width, height]);

        const link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line');

        const color = level => `hsl(${Math.floor(level * 30)}, 100%, 50%)`;

        const node = svg.append('g')
            .attr('fill', '#fff')
            .attr('stroke', '#000')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('fill', d => {
                console.log('level', d.data.level);
                return d.children ? color(d.data.level) : '#000';
            })
            .attr('stroke', d => d.children ? null : '#fff')
            .attr('r', 3.5)
            .call(drag(simulation));

        node.append('title')
            .text(d => `${d.data.name} (${d.data.level})`);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

    }



    const json = await queryData();
    const tree = makeTree(json, entity);
    console.log('tree', tree);

    draw(tree);
})();