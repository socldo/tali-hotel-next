pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "taiminh/tali-hotel-docker"
    }

    stages {

        stage('Build Image') {
        agent any
        steps {
            script {
                docker.build('tali-hotel-docker')
            }
        }
    }
        stage('Test') {
            agent {
                docker {
                    image 'tali-hotel-docker'
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh "npm i -f"
                sh "npm run dev"
            }
        }

        stage('build') {
            agent { node {label 'master'}}
            environment {
                DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${BUILD_NUMBER}-${GIT_COMMIT.substring(0,7)}"
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub')])
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