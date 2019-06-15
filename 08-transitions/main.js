(function() {
    console.log('starting');

    const scale = 2;

    

    const root = d3.select('div.root');
    const item = root.selectAll('div.items')
        .data(['hello', 'coucou', 'titi'])
        .enter()
        .append('div')
        .classed("item", true)
        .text(d => d)
        .style("transform", (d, i) => `translate(0, ${i * scale}em)`);
})();