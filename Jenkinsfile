timestamps { script {
    node('pocjoice') {
        //----------------------------------------
        String VAR_REGION  = 'us-east-1'
        String VAR_CRED    = 'aws-devops-test'
        String VAR_ECR     = '731735707548.dkr.ecr.us-east-1.amazonaws.com'
        String VAR_IMAGE   = 'pocjoicedevops'
        String VAR_CLUSTER = 'POCJoiceDevOpsECSQA'
        String VAR_JSON    = 'taskdef.json'
        String VAR_SERVICE = 'POCJoiceDevOpsECSQASRV'
        //----------------------------------------
        stage('Checkout') {
            checkout scm
        }
        String VAR_FULLNAME = "${VAR_ECR}/${VAR_IMAGE}"
        // stage('Build/Push Image to ECR') {
        //     withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
        //        sh "aws ecr get-login-password | sudo docker login --username AWS --password-stdin ${VAR_ECR}"
        //     }
        //     sh "sudo docker build -t ${VAR_FULLNAME}:${BUILD_NUMBER} ." // --force-rm --pull
        //     sh "sudo docker tag ${VAR_FULLNAME}:${BUILD_NUMBER} ${VAR_FULLNAME}:latest"
        //     sh "sudo docker push ${VAR_FULLNAME}:latest"
        //     sh "sudo docker push ${VAR_FULLNAME}:${BUILD_NUMBER}"
        //     sh "sudo docker rmi ${VAR_FULLNAME}:latest ${VAR_FULLNAME}:${BUILD_NUMBER}"
        // }
        stage('Deploy QA') {
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
                writeFile(file: 'tmp.json',
                          text: readFile(file: VAR_JSON).replaceAll("@REPLACE_IMG@","${VAR_FULLNAME}:2")
                )
                sh "aws ecs register-task-definition --cli-input-json file://${WORKSPACE}/tmp.json"
                // int desiredCount = sh("aws ecs describe-services --services ${VAR_SERVICE} --cluster ${VAR_CLUSTER} | grep -m1 desiredCount | tr -dc [:digit:]", returnStdout: true)
                // sh "aws ecs update-service --cluster ${CLUSTER} --region ${REGION} --service ${SERVICE_NAME} --task-definition ${FAMILY}:${REVISION} --desired-count ${}"
            }
        }
    }
} }