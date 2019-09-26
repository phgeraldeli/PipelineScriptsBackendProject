timestamps{
    def label="dev-backend"
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        stage('Compile'){
            sh 'npm install'
        }
        stage('Test'){
            sh 'npm test'
        }
        stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }
        openshift.withCluster() {
            openshift.withProject('node-backend') {
                stage('cleanup') {
                    sh "oc delete all -l app=${label} -n node-backend"
                }
                stage('Create Template') {
                    def PROJETO = 'node-backend'
                    sh "oc new-app --file=template-nodejs.yml --param=LABEL=dev-backend --param=NAME=dev-backend --namespace=node-backend"
                    sh 'oc logs -f bc/dev-backend --namespace=node-backend'
                }
                stage('Build') {
                    sh 'oc delete buildconfig -l app=dev-backend -n node-backend'
                    def build = openshift.newBuild(".", "--strategy=source", "--name=dev-backend", "--labels app=dev-backend")
                    build.logs('-f')
                }
                stage('Deploy') {
                    openshift.selector("dc", "dev-backend").rollout()
                    def dc = openshift.selector("dc", "dev-backend")
                    dc.rollout().status()
                }
            }
        }
    }
}
