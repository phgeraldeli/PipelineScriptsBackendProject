timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
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
            openshift.withProject("${PROJECT}-qa") {
                stage('Build'){
                    if (!openshift.selector("bc", "${NAME}").exists()) {
                        echo "Criando build"
                        //openshift.newBuild("--name=${NAME}", "--image-stream=openshift/nodejs:10", "--binary", "-l app=${LABEL}")
                        //def build = openshift.selector("bc", "${NAME}").startBuild("--from-repo=.", "--wait")
                        def nb = openshift.newBuild("https://github.com/cmotta2016/PipelineScriptsBackendProject.git#openshift", "--strategy=source", "--image-stream=${IMAGESTREAM}", "--name=${NAME}", "-l app=${LABEL}")
                        def buildSelector = nb.narrow("bc").related("builds")
                        buildSelector.logs('-f')
                        /*timeout(5) { // Throw exception after 5 minutes
                            buildSelector.untilEach(1) {
                                return (it.object().status.phase == "Complete")
                            }
                        }
                        echo "Builds have been created: ${buildSelector.names()}"
                        //nb.logs()*/
                    }//if
                    else {
                        //def build = openshift.selector("bc", "${NAME}").startBuild("--from-repo=.", "--wait")
                        echo "Build já existe. Iniciando build"
                        def build = openshift.selector("bc", "${NAME}").startBuild()
                        build.logs('-f')
                    }//else
                    }//stage
                stage('Deploy QA') {
                    echo "Criando Deployment"
                    openshift.apply(openshift.process(readFile(file:'template-nodejs_v1.yml'), "--param-file=jenkins.properties"))
                    openshift.selector("dc", "${NAME}").rollout().latest()
                    def dc = openshift.selector("dc", "${NAME}")
                    dc.rollout().status()
                }//stage
            }//withProject
        }//withCluster
    }//node
}//timestamps
