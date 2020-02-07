timestamps {
    node('nodejs') {
        stage('Checkout'){
            checkout scm
            //checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/cmotta2016/nodejs-ex.git']]])
        }
        stage('Compile'){
            sh 'npm config set registry http://129.213.187.72/repository/npm-group/'
            sh 'npm install'
        }
        stage ('Test'){
            sh 'npm test'
        }
        stage ('Code Quality'){
            def sonar = load 'sonar.groovy'
            sonar.codeQuality()
        }
        stage('Build S2I'){
            sh 's2i build . hub.gke.linux4sysadmin.com.br/openshift/nodejs-010-centos7 container.gke.linux4sysadmin.com.br/node/k8s-nodejs --loglevel 1 --network host'
        }
        stage('Push Image'){
            withCredentials([usernamePassword(credentialsId: 'nexus-registry', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
            sh '''
            docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" container.gke.linux4sysadmin.com.br
            docker push container.gke.linux4sysadmin.com.br/node/k8s-nodejs
            docker rmi -f container.gke.linux4sysadmin.com.br/node/k8s-nodejs
            '''
            }
        }
        stage('Deploy'){
            sh 'kubectl apply -f k8s-nodejs.yml --validate=false'
        }
    }
}
