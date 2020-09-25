timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        stage('Security Test') {
            sh 'mkdir zap'
            sh 'chmod 777 zap'
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
            }//withCluster
        }
    }//node
}//timestamps
