timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        /*
        stage('Compile'){
            sh 'npm set registry http://cicdtools.oracle.msdigital.pro:8081/repository/npm-group'
            sh 'npm install'
            sh 'rm -rf teste-build.tgz > /dev/null 2>&1'
            sh 'tar czvf teste-build.tgz * --exclude node_modules'
        }
        stage('Test'){
	    sh 'rm -rf /tmp/workspace/Openshift/Nodejs/report/*'
            sh 'npm test'
        }
        stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }
        */
        /*
        stage('Dependency Check'){
           sh 'oc create -f depcheck_job_scan.yaml'
           sh 'sleep 10'
           sh 'oc logs -f job/node-backend-v1-depcheck'
           sh 'oc delete -f depcheck_job_scan.yaml'
        }*/
        openshift.withCluster() {
            openshift.withProject("cicd") {
                def jobTemplate = readFile(file:'zap_job_scan.yaml')
                openshift.delete(jobTemplate)
                def jobCreated = openshift.create(jobTemplate)
                def job = openshift.selector("job", "node-backend-v1-zap")
                timeout(5) {
                    job.untilEach(1) {
                        return (it.related('pods').object().status.phase != "Pending")
                    }
                }
                job.logs('-f')
                def obj = job.related('pods').object()
                if (obj.status.phase in ["Error", "Failed", "Cancelled"]) {
                    error(obj.toString())
                }
            }
            /*
            openshift.withProject("${PROJECT}-qa") {
                stage('Build'){
                    if (!openshift.selector("bc", "${NAME}").exists()) {
                        echo "Criando build"
                        //def nb = openshift.newBuild(".", "--strategy=source", "--image-stream=${IMAGE_BUILDER}", "--allow-missing-images", "--name=${NAME}", "-l app=${LABEL}")
                        def nb = openshift.newBuild("--name=${NAME}", "--image-stream=${IMAGE_BUILDER}", "--binary", "-l app=${NAME}", "--build-config-map npmrc:.")
                        def buildSelector = nb.narrow("bc").related("builds")
                        buildSelector.logs('-f')
                        def build = openshift.selector("bc", "${NAME}").startBuild("--from-archive=teste-build.tgz")
                        build.logs('-f')
                    }//if
                    else {
                        echo "Build já existe. Iniciando build"
                        def build = openshift.selector("bc", "${NAME}").startBuild("--from-archive=teste-build.tgz")
                        build.logs('-f')
                    }//else
                }//stage
                stage('Tagging Image'){
		            openshift.tag("${NAME}:latest", "${REPOSITORY}/${NAME}:latest")
                }//stage
                stage('Deploy QA') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}-qa.yml"), "--param-file=template_environments_qa"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
                */
                /*stage('Promote to HML'){
                    //routeHost = sh(script: "kubectl get ingress nodejs -n nodejs-qa -o jsonpath='{ .spec.rules[0].host }'", returnStdout: true).trim()
                    routeHost = openshift.raw("get route ${NAME} -o jsonpath='{ .spec.host }' --loglevel=4").out.trim()
                    input message: "Promote to HML. Test deployment: http://${routeHost}. Approve?", id: "approval"
                }
            }//withProject
            openshift.withProject("${PROJECT}-hml") {
                stage('Deploy HML') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}-hml.yml"), "--param-file=template_environments_hml"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject */
        }//withCluster
    }//node
}//timestamps
