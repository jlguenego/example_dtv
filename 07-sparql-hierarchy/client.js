const axios = require('axios');
const fs = require('fs');
const endPoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

const filename = process.argv[2] || './department.sparql.txt';
console.log('filename', filename);
const sparql = encodeURIComponent(fs.readFileSync(filename));
console.log('sparql', sparql);

// Make a request for a user with a given ID
axios.get(endPoint + `?query=${sparql}`, {
    headers: {
        Accept: 'text/csv'
    }
}).then(function (response) {
    // handle success
    console.log(response.data);
    fs.writeFileSync(filename + '.csv', response.data);
}).catch(function (error) {
    // handle error
    console.log('error', error);
});