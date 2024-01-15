pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "taiminh/tali-hotel-next-docker"
    }

    stages {
        stage('Test') {
            agent {
                docker {
                    image 'tali-hotel-docker'
                    args '-u 0:0 -v /tmp:/root/.cache'
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