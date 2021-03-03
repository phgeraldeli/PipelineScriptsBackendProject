timestamps { script {
    node('pocjoice') {
        //----------------------------------------
        String VAR_REGION  = 'us-east-1'
        String VAR_CRED    = 'aws-devops-test'
        String VAR_ECR     = '731735707548.dkr.ecr.us-east-1.amazonaws.com'
        String VAR_IMAGE   = 'pocjoicedevops'
        String VAR_CLUSTER = 'POCJoiceDevOpsEKS'
        String VAR_YML     = 'deployment.yml'
        //----------------------------------------
        stage('Checkout') {
            checkout scm
        }
        String VAR_FULLNAME = "${VAR_ECR}/${VAR_IMAGE}"
        stage('Build/Push Image to ECR') {
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
               sh "aws ecr get-login-password | sudo docker login --username AWS --password-stdin ${VAR_ECR}"
            }
            sh "sudo docker build -t ${VAR_FULLNAME}:${BUILD_NUMBER} ." // --force-rm --pull
            sh "sudo docker tag ${VAR_FULLNAME}:${BUILD_NUMBER} ${VAR_FULLNAME}:latest"
            sh "sudo docker push ${VAR_FULLNAME}:latest"
            sh "sudo docker push ${VAR_FULLNAME}:${BUILD_NUMBER}"
            sh "sudo docker rmi ${VAR_FULLNAME}:latest ${VAR_FULLNAME}:${BUILD_NUMBER}"
        }
        stage('Deploy QA') {
            String VAR_APP = 'joiceqa'
            String VAR_ENV = 'qa'
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
                sh "aws eks update-kubeconfig --name ${VAR_CLUSTER}"
                // FAZER DOWNLOAD DO KUBECTL
                sh 'curl -o kubectl http://dadhx05.interno:8081/repository/jenkins-dependencies/kubectl_v1.18'
                sh 'chmod +x ./kubectl'

                sh './kubectl cluster-info'
                writeFile(file: 'tmp.yml',
                          text: readFile(file: VAR_YML).replaceAll("@REPLACE_APP@",VAR_APP)
                                                       .replaceAll("@REPLACE_ENV@",VAR_ENV)
                                                       .replaceAll("@REPLACE_IMG@","${VAR_FULLNAME}:${BUILD_NUMBER}")
                )
                sh './kubectl apply -f tmp.yml'
                sh "./kubectl rollout status deployment.apps/${VAR_APP} -n ${VAR_APP}"
            }
        }
        stage('Deploy HML') {
            String VAR_APP = 'joicehml'
            String VAR_ENV = 'hml'
            withAWS(region: VAR_REGION, credentials: VAR_CRED) {
                sh "aws eks update-kubeconfig --name ${VAR_CLUSTER}"
                sh './kubectl cluster-info'
                writeFile(file: 'tmp.yml',
                          text: readFile(file: VAR_YML).replaceAll("@REPLACE_APP@",VAR_APP)
                                                       .replaceAll("@REPLACE_ENV@",VAR_ENV)
                                                       .replaceAll("@REPLACE_IMG@","${VAR_FULLNAME}:${BUILD_NUMBER}")
                )
                sh './kubectl apply -f tmp.yml'
                sh "./kubectl rollout status deployment.apps/${VAR_APP} -n ${VAR_APP}"
            }
        }
    }
} }