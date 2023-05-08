const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const epsg = require('epsg');
// const proj4 = require('proj4');

// get Port, file path,
const { PORT = 4000,
    filePath = '../osm-proj/build/index.html',
    folderName = 'osm-proj',
    mongoURI = "mongodb+srv://minka-epsg:kCCcG4k4LaD6DbEy@cluster0.khsprzk.mongodb.net/?retryWrites=true&w=majority" } = {};

// include these before other routes
app.options('*', cors());
app.use(cors());

// celebrate error handler
app.use(errors());

// Connecting to database
mongoose.connect(mongoURI)
    .catch((err) => {
        console.log(err);
    });

// parse application/json
app.use(bodyParser.json());
app.use('/', require('./routes/urls'));

app.get('/', (req, res) => {
    if (req) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const urls = returnUrls(data, 'css, js');
            const str = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><link rel=\"icon\" href=\"/favicon.ico\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#0000acd\"/><meta name=\"description\" content=\"Web site created using create-react-app\"/><link rel=\"apple-touch-icon\" href=\"/logo192.png\"/><link rel=\"manifest\" href=\"/manifest.json\"/><title>EPSG Fidner</title><script defer=\"defer\" src=\"${urls.js}\"></script><link href=\"${urls.css}\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"root\"></div></body></html>`;

            fs.writeFile(filePath, str, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.sendFile(path.join(__dirname, '..') + `/${folderName}/build/index.html`);
            });
        });
    }
});

app.use(express.static(`../${folderName}/build`));

app.get('/coordinates', (req, res) => {
    let class_list, str = '';
    if (req.query.list) {
        class_list = req.query.list.split(',').map(parseFloat);
    } else {
        res.send('Wrong input!')
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const urls = returnUrls(data, 'js css');
        str = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><link rel=\"icon\" href=\"/favicon.ico\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#0000acd\"/><meta name=\"description\" content=\"Web site created using create-react-app\"/><link rel=\"apple-touch-icon\" href=\"/logo192.png\"/><link rel=\"manifest\" href=\"/manifest.json\"/><title>EPSG Fidner</title><script defer=\"defer\" src=\"${urls.js}\"></script><link href=\"${urls.css}\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"root\" class=\"${class_list}\"></div></body></html>`;

        fs.writeFile(filePath, str, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            res.sendFile(path.join(__dirname, '..') + `/${folderName}/build/index.html`);
        });
    });
});

app.get('/generate', (req, res) => {
    let class_list = '', str = '', name = '';
    const { epsg, x1, x2, y1, y2, format } = req.query;
    if (req.query.name) {
        name = req.query.name;
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const urls = returnUrls(data, 'css, js');
        if (x1 !== x2 && epsg) {
            if (y1 !== y2 && format) {
                class_list = `${epsg} ${x1} ${y1} ${x2} ${y2} ${format} ${name}`;
                str = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><link rel=\"icon\" href=\"/favicon.ico\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#0000acd\"/><meta name=\"description\" content=\"Web site created using create-react-app\"/><link rel=\"apple-touch-icon\" href=\"/logo192.png\"/><link rel=\"manifest\" href=\"/manifest.json\"/><title>EPSG Fidner</title><script defer=\"defer\" src=\"${urls.js}\"></script><link href=\"${urls.css}\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"root\" class=\"${class_list}\"></div></body></html>`;
            }
        } else {
            str = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><link rel=\"icon\" href=\"/favicon.ico\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#0000acd\"/><meta name=\"description\" content=\"Web site created using create-react-app\"/><link rel=\"apple-touch-icon\" href=\"/logo192.png\"/><link rel=\"manifest\" href=\"/manifest.json\"/><title>EPSG Fidner</title><script defer=\"defer\" src=\"${urls.js}\"></script><link href=\"${urls.css}\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"root\"></div></body></html>`;
        }
        fs.writeFile(filePath, str, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            res.sendFile(path.join(__dirname, '..') + `/${folderName}/build/index.html`);
        });
    });
});

// app.get('/edit123File', (req, res) => {
//     let returnText = '';
//     let isFirst = true;
//     let tempRow = '';
//     let isIndex2 = false;
//     const readStream = fs.createReadStream('../osm-proj/123.txt', { encoding: 'utf8' });
//     const writeStream = fs.createWriteStream('../osm-proj/1234.txt');
//     readStream.on('data', (chunk) => {
//         let newArr = '';
//         if (chunk) {
//             const tRegex = /\t/g;
//             newArr = chunk.replace(tRegex, ",");
//             if (newArr) {
//                 newArr = newArr.split('\r\n');
//                 // ? if there is a remainder from the last reading it`ll be remembered here
//                 if (tempRow) {
//                     let tempStr = '';
//                     let asd = '';
//                     if (newArr[0][newArr[0].length - 1] === ',') {
//                         asd = removeIndexedChar(newArr[0], newArr[0].length);
//                     }
//                     if (newArr[0][0] === ',') {
//                         tempStr = removeIndexedChar(asd, 1);
//                     }
//                     tempRow += `${tempStr}`;
//                     let arr = tempRow.split(',').map(parseFloat);
//                     if (arr[4]) {
//                         arr.splice(4, 1);
//                     }
//                     if (!isIndex2 && arr[2]) {
//                         arr[2] = arr[2] / 1000;
//                     }
//                     if (arr[3]) {
//                         returnText = `${arr[0]} ${arr[1]} ${arr[2]}\r\n`;
//                     }
//                 }
//                 // ? checkes if its the first page
//                 if (isFirst) {
//                     returnText = `${newArr[0]}\r\n${newArr[1]}\r\n${newArr[2]}\r\n${newArr[3]}\r\n${newArr[4]}\r\n${newArr[5]}\r\n`;
//                 }
//                 for (let i = isFirst ? 6 : 0; i < newArr.length; i++) {
//                     let arr = newArr[i].split(',').map(parseFloat);
//                     arr.splice(4, 1);
//                     for (let j = 0; j < arr.length; j++) {
//                         if (!arr[j] && arr[j] !== 0) {
//                             arr.splice(j, 1);
//                         }
//                     }
//                     if (arr[2]) {
//                         arr[2] = arr[2] / 1000;
//                     }
//                     if (arr[3] || arr[3] === 0) {
//                         returnText += `${arr[0]} ${arr[1]} ${arr[2]}\r\n`;
//                     } else {
//                         if (i !== 0) {
//                             tempRow = '';
//                             for (let j = 0; j < arr.length; j++) {
//                                 tempRow += `${arr[j]},`;
//                             }
//                         }
//                         if (arr[2]) {
//                             isIndex2 = true;
//                         } else {
//                             isIndex2 = false;
//                         }
//                     }
//                 }
//                 isFirst = false;
//             }
//             writeStream.write(returnText);
//             returnText = '';
//         }
//     });

//     readStream.on('end', () => {
//         console.log('File read complete.');
//     });

//     readStream.on('error', (err) => {
//         console.error(err);
//     });
// });

// app.get('/divide', (req, res) => {
//     let { dividend, divisor } = req.query;
//     divisor = parseFloat(divisor);
//     dividend = parseFloat(dividend);

//     if (dividend > 2147483647) {
//         return 2147483647;
//     } else if (dividend < -2147483648) {
//         return -2147483648;
//     }

//     if (divisor === 0) {
//         return NaN;
//     } else if (divisor === -1 && dividend === -2147483648) {
//         return 2147483647;
//     } else if (divisor === 1) {
//         return dividend;
//     }

//     const sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;

//     let dividendPositive = Math.abs(dividend);
//     const divisorPositive = Math.abs(divisor);

//     let counter = 0;

//     // Perform binary long division
//     while (dividendPositive >= divisorPositive) {
//         if (dividendPositive >= divisorPositive) {
//             dividendPositive -= divisorPositive;
//             counter++;
//         }
//     }
//     counter *= sign;

//     return counter;
// })

// const removeIndexedChar = (str, index) => {
//     let tempStr = '';
//     for (let i = 0; i < str.length; i++) {
//         if (i !== index - 1) {
//             tempStr += str[i];
//         }
//     }
//     return tempStr;
// }

// app.get('/editFile', () => {
//     let final = '';
//     const toProj = epsg[`EPSG:26714`];
//     const fromProj = epsg[`EPSG:32614`];
//     fs.readFile('SeisGlobe_optimal_polygon_LATina_project.cps3', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         let newArr = data.split('\r\n');
//         if (newArr) {
//             let coords = [];
//             for (let i = 0; i < newArr.length - 1; i++) {
//                 coords = newArr[i].split(' ').map(parseFloat);
//                 if (coords) {
//                     let coordinates = proj4(fromProj, toProj, [coords[0], coords[1]]);
//                     final += `${coordinates[0]} ${coordinates[1]}\r\n`;
//                 }
//             }
//             if (final) {
//                 fs.writeFile('SeisGlobe_optimal_polygon_LATina_project.cps3', final, (err) => {
//                     if (err) {
//                         console.error(err);
//                         return;
//                     }
//                 });
//             }
//         }
//     });
// });

const returnUrls = (data, whatToReturn) => {
    let cssUrl = '/', jsUrl = '/';
    let returnObj = {};
    let startIndex = 0, endIndex = 0;
    if (data) {
        // ! Setting the JS file URL to the current one
        if (whatToReturn.indexOf('js') !== -1) {
            startIndex = data.indexOf('\"', data.indexOf('src')) + 2;
            endIndex = data.indexOf('\"', startIndex);
            for (let i = 0; i < endIndex - startIndex; i++) {
                jsUrl += data[startIndex + i];
            }
            returnObj.js = jsUrl;
        }
        if (whatToReturn.indexOf('css') !== -1) {
            // ! Setting the CSS file URL to the current one
            startIndex = data.indexOf('\"', data.indexOf('href', endIndex)) + 2;
            endIndex = data.indexOf('\"', startIndex);
            for (let i = 0; i < endIndex - startIndex; i++) {
                cssUrl += data[startIndex + i];
            }
            returnObj.css = cssUrl;
        }
    }

    return returnObj;
};

app.listen(PORT, function () {
    console.log(`App is running on port ${PORT}`);
});
