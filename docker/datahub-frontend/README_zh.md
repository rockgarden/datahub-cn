# DataHub 前端 Docker 映像

请参阅 [DataHub 前端服务](../../datahub-frontend) 以快速了解 DataHub 的架构和该服务的职责。该服务对 DataHub 的责任。

## 签出 DataHub UI

启动 Docker 容器后，您可以在自己喜欢的网络浏览器中输入以下内容来连接它：

如果使用 React 应用程序：<http://localhost:9002>

你可以用 `datahub` 作为用户名和密码登录。

## 构建说明

如果你想自己构建 `datahub-frontend` Docker 镜像，可以从本地 DataHub 仓库的根目录运行此命令（使用Buildkit）：

`DOCKER_BUILDKIT=1 docker build -t your_datahub_frontend -f ./docker/datahub-frontend/Dockerfile .`

请注意最后的 `.`和标签 `your_datahub_frontend` 是由你决定的。
