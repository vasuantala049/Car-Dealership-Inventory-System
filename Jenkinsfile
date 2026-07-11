pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'mvn -B clean compile'
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh 'mvn verify'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Test') {
            steps {
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml, backend/target/failsafe-reports/*.xml'
            jacoco(
                execPattern: 'backend/target/jacoco.exec',
                classPattern: 'backend/target/classes',
                sourcePattern: 'backend/src/main/java',
                inclusionPattern: '**/*.class',
                exclusionPattern: '**/target/**'
            )
        }
    }
}
