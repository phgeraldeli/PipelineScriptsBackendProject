timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        stage('Compile'){
            //sh 'npm set registry http://cicdtools.oracle.msdigital.pro:8081/repository/npm-group'
            sh 'npm install'
        }
        stage('Test'){
            sh 'npm test'
        }
        /*stage('Dependency Check'){
           sh 'oc create -f job.yaml'
           sh 'sleep 10'
           sh 'oc logs -f job/dependency-nodejs'
           sh 'oc delete -f job.yaml'
        }*/
        /*stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }*/
        openshift.withCluster() {
            openshift.withProject("cicd") {
              stage('Dependency Check'){
                def job = openshift.create(openshift.process(readFile(file:"job.yaml")
                job.logs('-f')
                openshift.selector("job", "dependency-nodejs").delete()
              }
            }
            openshift.withProject("${PROJECT}-qa") {
                stage('Build'){
                    if (!openshift.selector("bc", "${NAME}").exists()) {
                        echo "Criando build"
                        def nb = openshift.newBuild(".", "--strategy=source", "--image-stream=${IMAGE_BUILDER}", "--allow-missing-images", "--name=${NAME}", "-l app=${LABEL}")
                        def buildSelector = nb.narrow("bc").related("builds")
                        buildSelector.logs('-f')
                    }//if
                    else {
                        echo "Build já existe. Iniciando build"
                        def build = openshift.selector("bc", "${NAME}").startBuild()
                        build.logs('-f')
                    }//else
                    }//stage
                stage('Deploy QA') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}-unique.yml"), "--param-file=template_environments"), "-l environment!=hml")
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject
            openshift.withProject("${PROJECT}-hml") {
                stage('Deploy HML') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}-unique.yml"), "--param-file=template_environments"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject
        }//withCluster
    }//node
}//timestamps
