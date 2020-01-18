const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const puppeteer = require('puppeteer');

const writeFileAsync = util.promisify(fs.writeFile);

getGithub()

async function getGithub() {
    try {
        // Prompting for github user
        const github = await inquirer.prompt({
            type: "input",
            message: "Enter your GitHub profile",
            name: "user"
        });

        // Prompting for color
        const favColor = await inquirer.prompt({
            type: "input",
            message: "Enter your favorite color",
            name: "color"
        })

        const setColor = favColor.color;

        // Axios call to get github star count
        const githubStars = await axios.get(
            `https://api.github.com/users/${github.user}/starred`
        );

        // Axios call to get github user info
        const githubResult = await axios.get(
            `https://api.github.com/users/${github.user}`
        );

        console.log("One moment please...")

        // Declaring html as the generateHTML function.
        // Passing in the github info, github stars, and color into the function
        const html = generateHTML(githubResult, githubStars, setColor);

        writeFileAsync("index.html", html)
            .then((async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(html, {waitUntil: "networkidle2"});
                await page.pdf({path: 'devProfile.pdf', format: 'A4', printBackground: true});
               
                await browser.close();
                console.log("Your PDF Developer Profile has been created.")
            })())
    }
    catch (err) {
        console.log(err);
    }
}

// Function for the html generation.
// The Font Awesome icons do not render in the pdf. However, they still apear if the user opens the html page.
function generateHTML(githubResult, githubStars, setColor) {
    return `
    <!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <script src="https://kit.fontawesome.com/5442a2e73b.js" crossorigin="anonymous"></script>
    </head>
    <body>
        <style>
        @import url("https://fonts.googleapis.com/css?family=Gayathri&display=swap");
        body {
            font-family: 'Gayathri', sans-serif;
            background-color: rgb(214, 214, 214);
        }        
        h3 {
            margin-top: 10px;
        }
        i {
            color: white;
        }  
        .container {
            margin: 0 auto;
        }       
        .cardTitle {
            color: white !important;
        }       
        .white-text {
            font-size: 20px;
        }
        </style>
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
                           <a class="white-text" href="https://www.google.com/maps/place/${githubResult.data.location}">${githubResult.data.location}</a>
                        </span>
                        <br>
                        <span class="white-text">
                            <a class="white-text" href="${githubResult.data.html_url}"><i class="fab fa-github"></i>Github</a>
                            <br>
                            <a class="white-text" href="${githubResult.data.blog}"><i class="fas fa-rss"></i>Blog</a>
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
                        <h5 class="cardTitle">Public Repositories</h5>
                        <span class="white-text">
                        ${githubResult.data.public_repos}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h5 class="cardTitle">Followers</h5>
                        <span class="white-text">
                            ${githubResult.data.followers}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h5 class="cardTitle">GitHub Stars</h5>
                        <span class="white-text">
                            ${githubStars.data.length}
                        </span>
                    </div>
                </div>
                <div class="col s6 m6 l6">
                    <div class="card-panel ${setColor} lighten-2 center-align">
                        <h5 class="cardTitle">Following</h5>
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