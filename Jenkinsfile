timestamps{
    node('nodejs'){
        stage('Checkout'){
            checkout scm
        }
        openshift.withCluster() {
            openshift.withProject("cicd") {
                echo 'Job'
                def job = openshift.create("zap_job_scan.yaml")
                echo 'JobProcess'
                def jobProcess = openshift.process(job)
                echo 'Create'
                openshift.create(jobProcess)
            }
        }
    }
}
