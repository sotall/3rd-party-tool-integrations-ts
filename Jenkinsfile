@Library('shared-pipeline@master')
import buildState.St
import groovy.transform.Field

def st = new St()

def emoji(status) {
    switch ( status ) {
        case "success": return "✅"
        case "error": return "🛑"
        case "info": return "ℹ️"
        default: return ""
    }
}

def buildText() {
    if (env.BRANCH_NAME == "main") {
        return "Build & Deploy Results"
    } else {
        return "Build Results for ${env.BRANCH_NAME}"
    }
}

def messageText(status) {
    if (status == "success") {
        return "Successful"
    } else {
        return "Problems were found. Check the logs for details."
    }
}

def sendNotification(status) {
    nweaRingCentral.post(
            roomUrl: 'https://hooks.ringcentral.com/webhook/v2/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdCI6ImMiLCJvaSI6IjI0NzIwNzUyNjUiLCJpZCI6IjE3MTk5MjY4MTEifQ.ItVVM4XGYUIxC81wZZAPl_djlc2BqrxEy2iOvO9OrRQ',
            activity: "${emoji(status)} ${buildText()}",
            iconUri: 'https://img.icons8.com/external-those-icons-fill-those-icons/344/external-Death-Star-geek-those-icons-fill-those-icons-2.png',
            text: "${messageText(status)} ∙ Build #${env.BUILD_NUMBER}"
    )
}

def getAppVersion() {
    def contents = readJSON file: './package.json'
    return contents.version
}

@Field def NODE_VERSION = "16.14.2"
@Field def YARN_VERSION = "1.22.19"

def getDockerBuildArgs() {
    String buildArgs = """--build-arg NODE_VERSION=${NODE_VERSION} \
                        --build-arg YARN_VERSION=${YARN_VERSION}"""
    if (params.clearDockerCache) {
        buildArgs += ' --no-cache'
    }
    return buildArgs
}

pipeline {
    options {
        // colors in the logs
        ansiColor('xterm')
    }
    agent {
        dockerfile {
            label 'nwea-cloud-swarm'
            registryCredentialsId 'dockerhub account'
            filename 'Dockerfile'
            additionalBuildArgs getDockerBuildArgs()
        }
    }
    stages {
        stage('Setup') {
            steps {
                appInfo()
                echo "================> BUILD INFORMATION ================>"
                echo "Application: ${env.APP_NAME}"
                echo "Application version: v${env.APP_VERSION}"
                echo "<================ BUILD INFORMATION <================"
                sh 'yarn install --frozen-lockfile'
            }
        }
        stage("Snyk Dependency Check") {
            steps {
                snykSecurity(
                        projectName: '3rd-party-tool-integrations-ts',
                        failOnIssues: true,
                        organisation: 'assessment-taco-dog',
                        severity: 'high',
                        snykInstallation: 'SNYK_STABLE',
                        snykTokenId: 'snyk-assessment-taco-dog',
                )
            }
        }
//        stage('Unit Tests') {
//            steps {
//                sh 'npm run unit-test-coverage -- --silent'
//            }
//        }
//        stage('SonarQube Analysis') {
//            steps {
//                withSonarQubeEnv('sonarqube.mgmt.nweacolo.pvt') {
//                    publishHTML(target: [
//                            allowMissing         : false,
//                            alwaysLinkToLastBuild: false,
//                            keepAll              : true,
//                            reportDir            : 'coverage/lcov-report',
//                            reportFiles          : 'index.html',
//                            reportName           : "unit-test-coverage"
//                    ])
//                    sh "npm run sonarqube-analysis"
//                }
//            }
//        }
//        stage("SonarQube Quality Gate") {
//            steps {
//                timeout(time: 1, unit: 'HOURS') {
//                    waitForQualityGate abortPipeline: true
//                }
//            }
//        }
        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                lock("build:${env.BRANCH_NAME}") {
                    script {
                        nweaNexus.pushNpm({
                            sh 'npm publish --registry https://artifacts.americas.nwea.pvt/nexus/content/repositories/npm-internal/'
                        })
                    }
                }
            }
        }
    }
    post {
        success {
            sendNotification('success')
        }
        failure {
            sendNotification('error')
        }
        cleanup {
            cleanWs notFailBuild: true
        }
    }
}