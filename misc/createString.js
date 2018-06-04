const process = require('process');
const year = +process.argv[2];
const month = +process.argv[3];
const from = +process.argv[4];
const to = +process.argv[5];

console.log('-------------', year, month, from, to);
console.log(JSON.stringify(createString(year, month, from, to), null, 2));
console.log('-------------');

function createString (year, month, from, to) {
    var x = [];
    for (var i = from; i <= to; i++) {
        x.push({
            file: 'https://s3.amazonaws.com/navarjuncom/Photography/' + year + '/' + (month < 10 ? '0' + month : month) + '/' + i + '.jpg'
        });
    }
    return x;
};
