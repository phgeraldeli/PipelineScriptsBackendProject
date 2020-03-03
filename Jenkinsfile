timestamps {
    node('nodejs') {
        stage('Checkout'){
            checkout scm
            //checkout([$class: 'GitSCM', branches: [[name: '*/aks']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
        }
        stage('Compile with Azure Artifacts'){
            //sh 'npm config set registry=https://pkgs.dev.azure.com/carlosmotta0608/_packaging/carlosmotta0608/npm/registry/'
            sh 'npm config set registry=https://pkgs.dev.azure.com/carlosmotta0608/cicd/_packaging/npm-feed/npm/registry/'
            sh 'npm config set always-auth=true'
            sh 'cp /opt/npm/.npmrc /home/jenkins/'
            sh 'npm install'

        }
        stage ('Test'){
            sh 'npm test'
        }
        stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }
        stage('Quality Gate'){
            sleep(30)
            timeout(activity: true, time: 30, unit: 'SECONDS') {
                def qg = waitForQualityGate()
                if (qg.status.toUpperCase() == 'ERROR') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }//if
            }//timeout
        }//stage*/
        stage('Build with S2I'){
            sh 's2i build . cmotta2016/nodejs-10-bases2i:latest cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER} --loglevel 1 --network host'
        }
        stage('Push Image to ACR'){
            withCredentials([usernamePassword(credentialsId: 'acr-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
            sh '''
            docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" cmotta2016.azurecr.io
            docker tag cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER} cmotta2016.azurecr.io/nodejs-qa:latest
            docker push cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER}
            docker push cmotta2016.azurecr.io/nodejs-qa:latest
            docker rmi -f cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER} cmotta2016.azurecr.io/nodejs-qa:latest
            '''
            }
        }
        stage('Deploy on AKS'){
            def deployment = sh(script: "kubectl get deployment nodejs -n nodejs-qa -o jsonpath='{ .metadata.name }' --ignore-not-found", returnStdout: true).trim()
            if (deployment == "nodejs") {
                sh 'kubectl set image deployment/nodejs nodejs=cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER} --record -n nodejs-qa'
            }
            else {
                sh 'kubectl apply -f aks-nodejs.yaml --validate=false'
            }
            //sh 'kubectl apply -f aks-nodejs.yaml --validate=false'
            //sh 'kubectl apply -f aks-nodejs-blue.yaml --validate=false'
            //sh 'sleep 30'
            //sh 'kubectl set image deployment/nodejs nodejs=cmotta2016.azurecr.io/nodejs-qa:${BUILD_NUMBER} --record -n nodejs-qa'
            //sh 'kubectl rollout status deployment.apps/blue-nodejs -n nodejs
            //sh 'kubectl apply -f aks-nodejs.yaml --validate=false'
            //sh 'kubectl wait --for=condition=Available deployment/nodejs -n nodejs --timeout=90s'
            sh 'kubectl rollout status deployment.apps/nodejs -n nodejs-qa'
            //def routehost = sh(script: "kubectl get ingress nodejs -n nodejs -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
            //echo "http://routehost"
        }
        stage('Test Deployment'){
            routeHost = sh(script: "kubectl get ingress nodejs -n nodejs-qa -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
            input message: "Test deployment: http://${routeHost}. Approve?", id: "approval"
        }
    }
}
