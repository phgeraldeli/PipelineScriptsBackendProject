timestamps {
    node('nodejs') {
        stage('Checkout'){
            checkout scm
            //checkout([$class: 'GitSCM', branches: [[name: '*/aks']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
        }
        stage('Compile'){
            //sh 'npm config set registry=https://pkgs.dev.azure.com/carlosmotta0608/_packaging/carlosmotta0608/npm/registry/'
            sh 'npm config set registry=https://pkgs.dev.azure.com/carlosmotta0608/cicd/_packaging/npm-feed/npm/registry/'
            sh 'npm config set always-auth=true'
            sh 'cp /opt/npm/.npmrc /home/jenkins/'
            sh 'npm install'

        }
        stage ('Test'){
            sh 'npm test'
        }
        /*stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }*/
        stage('Build S2I'){
            sh 's2i build . openshift/nodejs-010-centos7 cmotta2016.azurecr.io/k8s-nodejs:${BUILD_NUMBER} --loglevel 1 --network host'
        }
        stage('Push Image'){
            withCredentials([usernamePassword(credentialsId: 'acr-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
            sh '''
            docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" cmotta2016.azurecr.io
            docker tag cmotta2016.azurecr.io/k8s-nodejs:${BUILD_NUMBER} cmotta2016.azurecr.io/k8s-nodejs:latest
            docker push cmotta2016.azurecr.io/k8s-nodejs:${BUILD_NUMBER}
            docker push cmotta2016.azurecr.io/k8s-nodejs:latest
            docker rmi -f cmotta2016.azurecr.io/k8s-nodejs:${BUILD_NUMBER} cmotta2016.azurecr.io/k8s-nodejs:latest
            '''
            }
        }
        stage('Deploy'){
            sh 'kubectl apply -f aks-nodejs.yaml --validate=false; sleep 5'
            //sh 'kubectl apply -f aks-nodejs.yaml --validate=false'
            //sh 'kubectl wait --for=condition=Available deployment/nodejs -n nodejs --timeout=90s'
            sh 'kubectl rollout status deployment.apps/nodejs -n nodejs'
        }
    }
}
