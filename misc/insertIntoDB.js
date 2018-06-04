const process = require('process');
const fs = require('fs');
const request = require('request');
const path = require('path');

const filename = process.argv[2];
const collection = process.argv[3];

console.log(filename, collection);
var arr = readFile(filename);
insertAll(arr);

function readFile (filename) {
    const x = require(path.join(__dirname, filename));
    return x.reverse();
}

function insertAll (array, index = 0) {
    if (index >= array.length) {
        return;
    }
    request({
        method: 'PUT',
        url: 'http://localhost:3000/add/' + collection,
        headers: { 'auth': 'some_auth' },
        json: array[index]
    }, function (err, x, body) {
        if (!err) {
            console.log(index);
            setTimeout(() => {
                insertAll(array, ++index);
            }, 0);
        }
    });
}
