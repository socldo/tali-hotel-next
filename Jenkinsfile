pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "taiminh/tali-hotel-next-docker"
    }

    stages {
        stage('Test') {
            agent {
                docker {
                    registryUrl 'https://docker.io'
                    registryCredentialsId 'docker-hub'
                    image 'taiminh/tali-hotel-docker'
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh "npm i -f"
                sh "npm run dev"
            }
        }
    }
    

    post {
        success {
            echo "SUCCESSFUL"
        }
        failure {
            echo "FAILED"
        }
    }
}