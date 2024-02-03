pipeline{
    agent any

    parameters{
        string(name: "SPEC", defaultValue: "cypress/e2e/**", 
                description:"Ej:cypress/integration/pom/*.spec.js")
        choice(name: "BROWSER", choices: ["chrome", "firefox"],
                description:"Escoja un broser en donde ejecutar sus scripts.")
    }

    stages{
        stage('Build'){
            steps{
                echo "Building application"
            }
        }

        stage('Testing'){
            steps{
                bat "npm init"
                bat "npx cypress run --browser ${BROWSER} --spec ${SPEC}"
            }
        }
        stage('Deploy'){
            steps{
                echo "Deploying the application"
            }
        }
    }

}