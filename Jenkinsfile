timestamps {
    node('nodejs') {
        stage('Checkout'){
            checkout scm
        }
        stage('Install'){
            sh 'npm install'
        }
        stage ('Test'){
            sh 'npm test'
        }
        stage('Push Image to ECR'){
            // def token = sh(script: "aws ecr get-login-password --region us-east-1 --profile devops", returnStdout: true).trim()
            def token = sh(script: "aws ecr get-authorization-token --region us-east-1 --profile devops", returnStdout: true).trim().authorizationData.authorizationToken
            sh """docker login --username AWS -p ${token} 731735707548.dkr.ecr.us-east-1.amazonaws.com"""
            sh "docker build -t pocjoicedevops ."
            sh "docker tag pocjoicedevops:latest 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:latest"
            sh "docker push 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:latest"
        }
        stage('List Docker images on ECR') {
            sh "aws ecr describe-images --repository-name pocjoicedevops"
        }
        // stage('Deploy QA'){
        //     sh 'kubectl config set-context nodejs-qa --namespace=nodejs-qa && kubectl config use-context nodejs-qa'
        //     def deployment = sh(script: "kubectl get deployment nodejs -o jsonpath='{ .metadata.name }' --ignore-not-found", returnStdout: true).trim()
        //     if (deployment == "nodejs") {
        //         sh 'kubectl set image deployment/nodejs nodejs=myproject54352edd.azurecr.io/node-app:${BUILD_NUMBER} --record'
        //     }
        //     else {
        //         sh 'kubectl create -f aks-nodejs.yaml --validate=false -l env!=hml'
        //         sh 'kubectl set image deployment/nodejs nodejs=myproject54352edd.azurecr.io/node-app:${BUILD_NUMBER} --record'
        //     }
            //sh 'kubectl wait --for=condition=Ready deployment/nodejs -n nodejs-qa'
        //     sh 'kubectl rollout status deployment.apps/nodejs'
        // }
        /*stage('Promote to HML'){
            //routeHost = sh(script: "kubectl get ingress nodejs -n nodejs-qa -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
            input message: "Promote to HML. Approve?", id: "approval"
        }*/
        // stage('Test Deployment'){
        //     routeHost = sh(script: "kubectl get ingress nodejs -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
        //     input message: "Test deployment: http://${routeHost}. Approve?", id: "approval"
        // }
        /*stage('Deploy HML'){
            def deployment = sh(script: "kubectl get deployment nodejs -n nodejs-hml -o jsonpath='{ .metadata.name }' --ignore-not-found", returnStdout: true).trim()
            if (deployment == "nodejs") {
                sh 'kubectl set image deployment/nodejs nodejs=cmotta2016.azurecr.io/node-app:${BUILD_NUMBER} --record -n nodejs-hml'
            }
            else {
                sh "kubectl create -f aks-nodejs.yaml -n nodejs-hml --validate=false --dry-run -o yaml | sed 's/qa/hml/g' | kubectl apply --validate=false -f -"
                sh 'kubectl set image deployment/nodejs nodejs=cmotta2016.azurecr.io/node-app:${BUILD_NUMBER} --record -n nodejs-hml'
            }
            //sh 'kubectl wait --for=condition=Available deployment/nodejs -n nodejs --timeout=90s'
            sh 'kubectl rollout status deployment.apps/nodejs -n nodejs-hml'
        }
        stage('Test Deployment'){
            routeHost = sh(script: "kubectl get ingress nodejs -n nodejs-qa -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
            input message: "Test deployment: http://${routeHost}. Approve?", id: "approval"
        }*/
    }
}