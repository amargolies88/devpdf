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
                    // console.log(response.data);
                    //store data in data object
                    data.id = response.data.id;
                    data.fullName = (response.data.name) ? response.data.name : data.gun;
                    data.imageURL = response.data.avatar_url;
                    data.followerCount = response.data.followers;
                    data.pubRepoCount = response.data.public_repos;
                    data.blog = (response.data.blog ? response.data.blog : "");
                    data.followingCount = response.data.following;
                    data.location = response.data.location;
                    data.githuburl = response.data.html_url;
                    data.starsURL = response.data.starred_url;
                    data.bio = (response.data.bio) ?
                        `<div class="row">
                        <div class="col">
                            <div class="card">
                                <p>${response.data.bio}</p>
                            </div>
                        </div>
                    </div>`
                        : "";
                    
                    // console.log("data from first api call");
                    // console.log(data);

                    //get stars information
                    axios.get(`https://api.github.com/users/${data.gun}/starred`)
                        .then(function (response) {

                            //store stars data
                            data.stars = response.data.length;

                            // generate the html from the data
                            let html = generator.generateHTML(data);

                            // write html to html file (for testing)
                            // fs.writeFile('htmls.html', html, function (err) {
                            //     if (err) throw err;
                            //     console.log('Saved!');
                            // });

                            // convert html to pdf
                            conversion({ html: html }, function (err, result) {
                                if (err) {
                                    return console.error(err);
                                }
                                // console.log(result.numberOfPages);
                                // console.log(result.logs);
                                result.stream.pipe(fs.createWriteStream(`./profiles/${data.gun}_${data.id}.pdf`));
                                conversion.kill();
                            });
                            console.log(`Saved PDF file: ${data.gun}_${data.id}`);
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });


                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        });
}

init();