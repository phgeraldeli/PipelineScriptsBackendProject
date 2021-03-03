timestamps { script {
    node('pocjoice') { // ALTERAR NODE SE NECESSARIO
        String VAR_REGION  = 'us-east-1'
        String VAR_CRED    = 'aws-devops-test'
        String VAR_ECR     = '731735707548.dkr.ecr.us-east-1.amazonaws.com'
        String VAR_IMAGE   = 'pocjoicedevops'
        String VAR_CLUSTER = 'POCJoiceDevOpsEKS'
        stage('Checkout') {
            checkout scm
        }
        stage('Build/Push Image to ECR') {
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
               sh "aws ecr get-login-password | sudo docker login --username AWS --password-stdin ${VAR_ECR}"
            }
            sh "sudo docker build -t ${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER} ." // --force-rm --pull
            sh "sudo docker tag ${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER} ${VAR_ECR}/${VAR_IMAGE}:latest"
            sh "sudo docker push ${VAR_ECR}/${VAR_IMAGE}:latest"
            sh "sudo docker push ${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER}"
            sh "sudo docker rmi ${VAR_ECR}/${VAR_IMAGE}:latest ${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER}"
        }
        stage('Deploy QA') {
            String VAR_YML = 'deployment.yml'
            String VAR_APP = 'joiceqa'
            String VAR_ENV = 'qa'
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
                sh "aws eks update-kubeconfig --name ${VAR_CLUSTER}"
                // FAZER DOWNLOAD DO KUBECTL
                sh 'curl -o kubectl http://dadhx05.interno:8081/repository/jenkins-dependencies/kubectl_v1.18'
                sh 'chmod +x ./kubectl'
                // EXECUTAR KUBECTL DA PASTA LOCAL
                sh './kubectl cluster-info'
                sh """sed "s/@REPLACE_APP@/${VAR_APP}/g;s/@REPLACE_ENV@/${VAR_ENV}/g" ${VAR_YML} | ./kubectl apply -f -"""
                sh "./kubectl set image deployment/${VAR_APP} ${VAR_APP}=${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER} --record -n ${VAR_APP}"
                sh "./kubectl rollout status deployment.apps/${VAR_APP} -n ${VAR_APP}"
            }
        }
        stage('Deploy HML') {
            String VAR_YML = 'deployment.yml'
            String VAR_APP = 'joicehml'
            String VAR_ENV = 'hml'
            withAWS(region: VAR_REGION, credentials: VAR_CRED) {
                sh "aws eks update-kubeconfig --name ${VAR_CLUSTER}"
                // FAZER DOWNLOAD DO KUBECTL
                //sh 'curl -o kubectl http://dadhx05.interno:8081/repository/jenkins-dependencies/kubectl_v1.18'
                //sh 'chmod +x ./kubectl'
                // EXECUTAR KUBECTL DA PASTA LOCAL
                sh './kubectl cluster-info'
                sh """sed "s/@REPLACE_APP@/${VAR_APP}/g;s/@REPLACE_ENV@/${VAR_ENV}/g" ${VAR_YML} | ./kubectl apply -f -"""
                sh "./kubectl set image deployment/${VAR_APP} ${VAR_APP}=${VAR_ECR}/${VAR_IMAGE}:${BUILD_NUMBER} --record -n ${VAR_APP}"
                sh "./kubectl rollout status deployment.apps/${VAR_APP} -n ${VAR_APP}"
            }
        }
    }
} }
