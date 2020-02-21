#!/usr/bin/env sh
echo '************************************** 发送至服务器成功 **********************************************'

# 项目名，取自package.json的name字段，需要保持一致
projectName="${JOB_NAME}"
dockerImageName=${projectName}-${BUILD_TIMESTAMP}

# step1 解压源代码
echo " ************************************* 解压源代码${dockerImageName}.tar.gz start *************************************"

projectPath='/var/nodejs/' # 需要单独给用户赋目录/var/nodejs/的权限
sudo mkdir -p ${projectPath}${projectName} || true \
&& cd ${projectPath}${projectName} \
&& sudo rm -rf *  # 删除里面的数据

sudo tar -zxf ../${dockerImageName}.tar.gz -C ./ \
&& sudo rm  ../${dockerImageName}.tar.gz   # 删除发布过来的包

echo " ************************************* 解压源代码${dockerImageName}.tar.gz finish *************************************"

# step2 构建docker镜像
echo " ************************************* 构建docker镜像${dockerImageName} start *************************************"
sudo docker build -t ${dockerImageName} --build-arg SSH_KEY="$(cat ~/.ssh/id_rsa)" --force-rm=true -f ./staging.dockerfile .
echo ' ************************************* 构建docker镜像 finish *************************************'

# step3 重启容器
echo "************************************* 使用镜像${dockerImageName}启动容器${projectName}  start *************************************"
# egg.js日志统一存放在/var/nodejs/logs/${projectName}
sudo mkdir -p /var/nodejs/logs/${projectName} || true \
&& sudo docker stop ${projectName} || true \
&& sudo docker rm ${projectName} || true \
&& sudo docker run -d --net=host --name ${projectName} -v /var/nodejs/logs/${projectName}:/var/nodejs/logs/${projectName} ${dockerImageName}

echo "************************************* 使用镜像${dockerImageName}启动容器${projectName}  finish *************************************"

echo '************************************************ 查看docker容器情况: ************************************************ '
sudo docker ps -a


# step4 推送静态资源
echo '************************************************ 准备推送静态资源到目标服务器 ************************************************ '
rm -rf /tmp/${projectName}
echo '******执行 docker cp ${projectName}:/var/nodejs/FE-PROJECT/app/public/. /tmp/${projectName} *************'
docker cp ${projectName}:/var/nodejs/FE-PROJECT/app/public/. /tmp/${projectName}
echo '******执行 scp -r /tmp/${projectName} ubuntu@172.31.17.158:/var/static_files *************'
scp -r /tmp/${projectName} ubuntu@172.31.17.158:/var/static_files
echo '******执行 rm -rf /tmp/${projectName} *************'
rm -rf /tmp/${projectName}
echo '************************************************ 静态资源推送完毕 ************************************************ '
