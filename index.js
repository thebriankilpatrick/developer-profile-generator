const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

getGithub()

async function getGithub() {
    try {
        const github = await inquirer.prompt({
            type: "input",
            message: "Enter your GitHub profile",
            name: "user"
        });

        // const { favColor } = await inquirer.prompt({
        //     message: "Enter your favorite color",
        //     name: "favorit color"
        // })

        const githubResult = await axios.get(
            `https://api.github.com/users/${github.user}`
        );
        console.log(githubResult);
        
    }
    catch (err) {
        console.log(err);
    }
}

// getGithub function does not work as expected.  The github account that gets passed in, is showing as null.
// Thus, no account will pull
