timestamps { script {
    node('pocjoice') {
        //----------------------------------------
        String VAR_REGION      = 'us-east-1'
        String VAR_CRED        = 'aws-devops-test'
        String VAR_ECR         = '731735707548.dkr.ecr.us-east-1.amazonaws.com'
        String VAR_IMAGE       = 'pocjoicedevops'
        String VAR_CLUSTER_QA  = 'POCJoiceDevOpsECSQA'
        String VAR_CLUSTER_HML = 'POCJoiceDevOpsECSHML'
        String VAR_JSON        = 'taskdef.json'
        String VAR_SERVICE_QA  = 'POCJoiceDevOpsECSQASRV'
        String VAR_SERVICE_HML = 'POCJoiceDevOpsECSSVR1'
        String TASK_NAME_QA    = 'POCJoiceDevOpsECSQATD1'
        String TASK_NAME_HML   = 'POCJoiceDevOpsECSTD1'
        String CONTAINER_QA    = 'POCJoiceDevOpsECSQACT1'
        String CONTAINER_HML   = 'pocjoicedevopshml'
        int    DESIRED_COUNT   = 2
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
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
                writeFile(file: 'tmp_qa.json',
                          text: readFile(file: VAR_JSON).replaceAll("@REPLACE_IMG@","${VAR_FULLNAME}:${BUILD_NUMBER}")
                                                        .replaceAll("@REPLACE_FAMILY@","${TASK_NAME_QA}")
                                                        .replaceAll("@REPLACE_CONTAINER@", "${CONTAINER_QA}")
                                                        .replaceAll("@REPLACE_NETWORK_MODE@", "awsvpc")
                                                        .replaceAll("@REPLACE_COMPATIBILITY@", "FARGATE")
                )
                sh "aws ecs register-task-definition --cli-input-json file://${WORKSPACE}/tmp_qa.json"
                int revision = sh(script: "aws ecs describe-task-definition --task-definition ${TASK_NAME_QA} | grep revision | tr -dc [:digit:]", returnStdout: true)
                
                boolean serviceExists = sh(script: "aws ecs describe-services --services ${VAR_SERVICE_QA} --cluster ${VAR_CLUSTER_QA} | (grep -sm1 desiredCount || echo '-1') | tr -dc '0-9-'", returnStdout: true).toInteger() >= 0
                
                if(serviceExists) {
                    sh "aws ecs update-service --cluster ${VAR_CLUSTER_QA} --service ${VAR_SERVICE_QA} --task-definition ${TASK_NAME_QA}:${revision} --desired-count ${DESIRED_COUNT}"
                } else {
                    sh "aws ecs create-service --service-name ${VAR_SERVICE_QA} --desired-count ${DESIRED_COUNT} --task-definition ${TASK_NAME_QA} --cluster ${VAR_CLUSTER_QA}"
                }
            }
        }
        stage('Deploy HML') {
            withAWS(region: "${VAR_REGION}", credentials: "${VAR_CRED}") {
                writeFile(file: 'tmp_hml.json',
                          text: readFile(file: VAR_JSON).replaceAll("@REPLACE_IMG@","${VAR_FULLNAME}:${BUILD_NUMBER}")
                                                        .replaceAll("@REPLACE_FAMILY@","${TASK_NAME_HML}")
                                                        .replaceAll("@REPLACE_CONTAINER@", "${CONTAINER_HML}")
                                                        .replaceAll("@REPLACE_NETWORK_MODE@", "bridge")
                                                        .replaceAll("@REPLACE_COMPATIBILITY@", "EC2")
                )

                sh "aws ecs register-task-definition --cli-input-json file://${WORKSPACE}/tmp_hml.json"
                int revision = sh(script: "aws ecs describe-task-definition --task-definition ${TASK_NAME_HML} | grep revision | tr -dc [:digit:]", returnStdout: true)
                boolean serviceExists = sh(script: "aws ecs describe-services --services ${VAR_SERVICE_HML} --cluster ${VAR_CLUSTER_HML} | (grep -sm1 desiredCount || echo '-1') | tr -dc '0-9-'", returnStdout: true).toInteger() >= 0
                
                if(serviceExists) {
                    sh "aws ecs update-service --cluster ${VAR_CLUSTER_HML} --service ${VAR_SERVICE_HML} --task-definition ${TASK_NAME_HML}:${revision} --desired-count ${DESIRED_COUNT}"
                } else {
                    sh "aws ecs create-service --service-name ${VAR_SERVICE_HML} --desired-count ${DESIRED_COUNT} --task-definition ${TASK_NAME_HML} --cluster ${VAR_CLUSTER_HML}"
                }
            }
        }
    }
} }

