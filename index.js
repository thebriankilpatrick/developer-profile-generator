const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

getGithub()

async function getGithub() {
    try {
        const github = await inquirer.prompt({
            type: "input",
            message: "Enter your GitHub profile",
            name: "user"
        });

        const favColor = await inquirer.prompt({
            type: "input",
            message: "Enter your favorite color",
            name: "color"
        })

        console.log(favColor.color);
        const setColor = favColor.color;

        const githubStars = await axios.get(
            `https://api.github.com/users/${github.user}/starred`
        );

        // console.log(githubStars.data.length);

        const githubResult = await axios.get(
            `https://api.github.com/users/${github.user}`
        );
        // console.log(githubResult.data);

        const html = generateHTML(githubResult, githubStars, setColor);

        writeFileAsync("index.html", html);
    }
    catch (err) {
        console.log(err);
    }
}

function generateHTML(githubResult, githubStars, setColor) {
    return `
    <!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <link rel="stylesheet" href="assets/style.css">
        <link href="https://fonts.googleapis.com/css?family=Gayathri&display=swap" rel="stylesheet">
    </head>
    <body>
        <nav>
            <div class="nav-wrapper ${setColor} lighten-2">
              <a href="#" class="brand-logo center">${githubResult.data.name}</a>
            </div>
        </nav>
        <div class="container">
            <div class="row">
                <div class="col s12 m12 l12">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <a>
                            <img class="circle" src="${githubResult.data.avatar_url}">
                        </a>
                        <h3 class="cardTitle">Hello there!</h3>
                        <h4 class="cardTitle">My name is ${githubResult.data.name}</h4>
                        <span class="white-text">
                            ${githubResult.data.location}
                        </span>
                        <br>
                        <span class="white-text">
                            Github:${githubResult.data.html_url}  Blog: ${githubResult.data.blog}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col s12 m12 l12">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <span class="white-text">
                            ${githubResult.data.bio}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h4 class="cardTitle">Public Repositories</h4>
                        <span class="white-text">
                        ${githubResult.data.public_repos}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h4 class="cardTitle">Followers</h4>
                        <span class="white-text">
                            ${githubResult.data.followers}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h4 class="cardTitle">GitHub Stars</h4>
                        <span class="white-text">
                            ${githubStars.data.length}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h4 class="cardTitle">Following</h4>
                        <span class="white-text">
                            ${githubResult.data.following}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
}
