const generator = require('./generateHTML');
const inquirer = require('inquirer');
var fs = require('fs'),
    convertFactory = require('electron-html-to');
var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});
const axios = require('axios');
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
            // console.log(answers.color);

            let data = {
                gun: answers.githubUsername,
                color: answers.color
            }
            // get all data before generating html
            // Make a request for a user with a given ID
            axios.get(`https://api.github.com/users/${data.gun}`)
                .then(function (response) {
                    // handle success
                    console.log(response.data);

                    //store data in data object
                    data.fullName = response.data.name;
                    data.imageURL = response.data.avatar_url;
                    data.followerCount = response.data.followers;
                    data.pubRepoCount = response.data.public_repos;
                    data.blog = response.data.blog;
                    data.followingCount = response.data.following;
                    data.location = response.data.location;

                    console.log(data);

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed

                    // generate the html from the data
                    let html = generator.generateHTML(data);
                    conversion({ html: html }, function (err, result) {
                        if (err) {
                            return console.error(err);
                        }
                        // console.log(result.numberOfPages);
                        // console.log(result.logs);
                        result.stream.pipe(fs.createWriteStream('./profile.pdf'));
                        conversion.kill();
                    });
                    console.log('hello');
                });
        });
}

init();