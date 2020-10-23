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
                    String buildConfigMaps;
                    stage('Build'){
                        if ( isJavascript ) {
                            String templateFile = "npmrc.file"
                            String cfgMapFile = ".npmrc"
                            String cfgMapName = "npmrc-nexus"
                            
                            println("[DEBUG] Applying ConfigMap '${cfgMapName}'...")
                            String logLevel = $TOOL_LOGLEVEL
                            String template = libraryResource "global/release/templates/${templateFile}"
                            template = template.replace( "@LOG_LEVEL@", logLevel ? "loglevel=${logLevel}" : "" )
                            String tempFilePath = sh(script: "mktemp --dry-run", returnStdout: true).trim()
                            writeFile encoding: 'UTF-8', file: tempFilePath, text: template
                            openshift.apply(openshift.raw("create configmap ${cfgMapName} --from-file=${cfgMapFile}=${tempFilePath} --dry-run --output=yaml").actions[0].out)
                            sh("rm -f ${tempFilePath}")
                            
                            
                            buildConfigMaps = "npmrc-nexus:." + ( buildConfigMaps ? ",${buildConfigMaps}" : "" )
                        }

                        if (!openshift.selector("bc", "${NAME}").exists()) {
                            echo "Criando build"

                            buildConfigMaps = "npmrc-nexus:." + (buildConfigMaps? ",${buildConfigMaps}" : "")

                            def nb = openshift.newBuild("--name=${NAME}",
                                                        "--image-stream=${IMAGE_BUILDER}",
                                                        "--binary", "-l app=${NAME}",
                                                        "--build-config-map=${buildConfigMaps}")

                            def buildSelector = nb.narrow("bc").related("builds")
                            buildSelector.logs('-f')
                            def build = openshift.selector("bc", "${NAME}").startBuild("--from-archive=teste-build.tgz")
                            build.logs('-f')
                        }//if
                        else {
                            echo "Build já existe. Iniciando build"
                            def build = openshift.selector("bc", "${NAME}")
                                            .startBuild("--from-archive=teste-build.tgz")
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
                    stage('Promote to HML'){
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
                }//withProject
            }//withCluster
        }//node
    }//timestamps
