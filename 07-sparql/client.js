const axios = require('axios');
const fs = require('fs');


const endPoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

const sparql = encodeURIComponent(fs.readFileSync('./department.sparql'));
console.log('sparql', sparql);

// Make a request for a user with a given ID
axios.get(endPoint + `?query=${sparql}`, {
    headers: {
        Accept: 'text/csv'
    }
}).then(function (response) {
    // handle success
    console.log(response.data);
    fs.writeFileSync('departments.csv', response.data);
}).catch(function (error) {
    // handle error
    console.log('error', error);
});