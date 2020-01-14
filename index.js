const axios = require("axios");
const inquirer = require("inquirer");

getGithub()

async function getGithub() {
    try {
        const { github } = await inquirer.prompt({
            message: "Enter your GitHub profile",
            name: "github profile"
        });

        const { data } = await axios.get(
            `https://github.com/${github}`
        );
    }
    catch (err) {
        console.log(err);
    }
}


// You need to have a file that gives the dependencies.
// This way, you can use the command "node i", to install those dependencies
