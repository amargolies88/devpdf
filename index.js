const generator = require('./generateHTML');
const htmlToPdf = require('html-to-pdf');
const inquirer = require('inquirer');



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
            htmlToPdf.convertHTMLString(html, 'path/to/destination.pdf',
                function (error, success) {
                    if (error) {
                        console.log('Oh noes! Errorz!');
                        console.log(error);
                    } else {
                        console.log('Woot! Success!');
                        console.log(success);
                    }
                }
            );
            console.log('hello');
        });
}

init();


// IMPORT EXAMPLE:
// var badmath = require("./badmath.js");
// console.log(badmath.pie);
// console.log(badmath.predictable());