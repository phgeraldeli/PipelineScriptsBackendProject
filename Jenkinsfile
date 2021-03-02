timestamps {
    node('pocjoice') {
        stage('Checkout'){
            checkout scm
        }
        stage('Build/Push Image to ECR'){
            // sh '{ set +x; } 2>/dev/null; sudo $(aws ecr get-login --profile devops --region us-east-1)'
            withAWS(region: 'us-east-1', credentials: 'aws-devops-test') {
               sh "aws ecr get-login-password | sudo docker login --username AWS --password-stdin 731735707548.dkr.ecr.us-east-1.amazonaws.com"
            }
            sh "sudo docker build -t 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:${BUILD_NUMBER} ." // Utilizar --force-rm e --pull?
            sh "sudo docker tag 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:${BUILD_NUMBER} 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:latest"
            sh "sudo docker push 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:latest"
            sh "sudo docker push 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:${BUILD_NUMBER}"
            sh "sudo docker rmi 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:latest 731735707548.dkr.ecr.us-east-1.amazonaws.com/pocjoicedevops:${BUILD_NUMBER}"
        }
        stage('Deploy HML') {
            withAWS(region: 'us-east-1', credentials: 'aws-devops-test') {
                sh "aws eks update-kubeconfig --name POCJoiceDevOpsEKS"
                sh 'curl -o kubectl http://dadhx05.interno:8081/repository/jenkins-dependencies/kubectl_v1.18'
                sh 'chmod +x ./kubectl'
                sh './kubectl cluster-info'
                sh "./kubectl apply -f deployment.yml"
            }
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