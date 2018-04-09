require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const archiver = require('archiver');
const package = require(process.cwd() + '/package.json');


if (package.enjin && package.enjin.copy) {
    let destinations = Object.keys(package.enjin.copy);

    if (destinations.length > 0) {
        destinations.forEach(dest => {
            let destDir = `${process.cwd()}/${package.enjin.root}/${dest}`;
            let srcFiles = package.enjin.copy[dest];

            srcFiles.forEach(file => {
                let filename = typeof file === 'string' ? path.basename(file) : Object.keys(file)[0];
                console.log(`Copying ${file} to ${destDir}...`);
                fs.copySync(typeof file === 'string' ? file : file[filename], `${destDir}/${filename}`);
            });
        });
    } else {
        console.log('No copy tasks setup.');
    }
}