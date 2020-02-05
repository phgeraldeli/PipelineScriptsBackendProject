timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        stage('Compile'){
            sh 'npm set registry http://cicdtools.oracle.msdigital.pro:8081/repository/npm-group'
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
            openshift.withProject("${PROJECT}-qa") {
                stage('Build'){
                    if (!openshift.selector("bc", "${NAME}").exists()) {
                        echo "Criando build"
                        def nb = openshift.newBuild(".", "--strategy=source", "--image-stream=${IMAGE_BUILDER}", "--name=${NAME}", "-l app=${LABEL}")
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
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}"), "--param-file=template_environments"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject
            /*openshift.withProject("${PROJECT}-hml") {
                stage('Deploy QA') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:"${TEMPLATE}"), "--param-file=template_environments"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject*/
        }//withCluster
    }//node
}//timestamps
