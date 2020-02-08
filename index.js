const generator = require('./generateHTML');
const inquirer = require('inquirer');
var fs = require('fs'),
    convertFactory = require('electron-html-to');
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

const questions = [

];

// Initialization function
function init() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'githubUsername',
                message: 'What is your github username?'
            },
            {
                type: 'list',
                name: 'color',
                message: 'What is your favorite color?',
                choices: ['green', 'blue', 'pink', 'red']
            }
        ])
        .then(answers => {
            console.log(answers.color);
            let html = generator.generateHTML(answers);
            conversion({ html: html }, function (err, result) {

                if (err) {
                    return console.error(err);
                }
                console.log(result.numberOfPages);
                console.log(result.logs);
                result.stream.pipe(fs.createWriteStream('./profile.pdf'));
                conversion.kill();
            });
            console.log('hello');
        });
}

init();