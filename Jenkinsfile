pipeline {
    agent any

    environment {
        ACR_REGISTRY = 'ecommercereglokashakhivelsp.azurecr.io'
        ACR_CREDENTIALS = 'acr-credentials'
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Building and testing all services...'
                bat 'java -version'
                bat 'mvn -v'
                bat 'mvn clean test'
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging all services...'
                bat 'mvn clean package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'
                script {
                    docker.build("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}", "-f catalog-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/cart-service:${BUILD_TAG}", "-f cart-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/order-service:${BUILD_TAG}", "-f order-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/user-service:${BUILD_TAG}", "-f user-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/frontend:${BUILD_TAG}", "-f frontend/Dockerfile frontend/")
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing images to Azure Container Registry...'
                script {
                    docker.withRegistry("https://${ACR_REGISTRY}", ACR_CREDENTIALS) {
                        docker.image("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/cart-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/cart-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/order-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/order-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/user-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/user-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/frontend:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/frontend:${BUILD_TAG}").push('latest')
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! Images pushed with tag: ${BUILD_TAG}"
        }
        failure {
            echo 'Pipeline failed — check the logs above.'
        }
    }
}