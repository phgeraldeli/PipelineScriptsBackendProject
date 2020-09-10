timestamps{
    node('nodejs'){
        stage('Checkout'){
            //checkout([$class: 'GitSCM', branches: [[name: '*/openshift']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/PipelineScriptsBackendProject.git']]])
            checkout scm
        }
        stage('Compile'){
            sh 'npm set registry http://cicdtools.oracle.msdigital.pro:8081/repository/npm-group'
            sh 'npm install'
            sh 'rm -rf teste-build.tgz > /dev/null 2>&1'
            sh 'tar czvf teste-build.tgz * --exclude node_modules'
        }
        openshift.withCluster() {
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
            }//withProject
        }//withCluster
    }//node
}//timestamps
