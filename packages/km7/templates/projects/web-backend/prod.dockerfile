FROM node:10.12.0-alpine as base
# FROM node:10.12.0 as base

# 设置工作目录
WORKDIR /var/nodejs/FE-PROJECT

# 配置python环境(node-gyp)，部分包(grpc)需要
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python

# 将package.json拷贝到docker里
COPY package.json ./

# 安装依赖
RUN npm set @ndog:registry http://172.31.29.76:4873 && \
    npm install --quiet --production

FROM base as builder
# 拷贝前端代码到工作目录
COPY ./src ./src/
RUN npm run build

FROM base
# 拷贝所有代码到工作目录
COPY . ./
COPY --from=builder /var/nodejs/FE-PROJECT/app/public/ ./app/public/
COPY --from=builder /var/nodejs/FE-PROJECT/config/manifest.json ./config/

# 暴露容器端口
EXPOSE 10241

# 启动node应用
CMD npm start
