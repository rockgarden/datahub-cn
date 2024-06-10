# JaaS 身份验证

## 概览

DataHub 前端服务器支持插入 [JaaS](https://docs.oracle.com/javase/7/docs/technotes/guides/security/jaas/JAASRefGuide.html) 模块。
这允许您使用自定义身份验证协议将用户登录到 DataHub。

默认情况下，我们提供了基于文件的用户名/密码验证模块配置示例（[PropertyFileLoginModule](http://archive.eclipse.org/jetty/8.0.0.M3/apidocs/org/eclipse/jetty/plus/jaas/spi/PropertyFileLoginModule.html)
配置了单一用户名/密码组合：datahub - datahub。

要更改或扩展默认行为，你有多种选择，每种选择都取决于你所处的部署环境。

### 直接修改 user.props 文件（本地测试）

自定义基于文件的用户的第一个选项是直接修改文件 `datahub-frontend/app/conf/user.props`。
添加所需用户后，只需运行 `./dev.sh` 或 `./datahub-frontend/run-local-frontend` 验证新用户能否登录。
新用户可以登录。

### 挂载自定义 user.props 文件（Docker Compose）

默认情况下，`datahub-frontend` 容器会查找挂载在容器路径下的名为`user.props`的文件
`datahub-frontend/conf/user.props`。如果希望使用一组自定义用户启动此容器，则需要在使用 `datahub-frontend/conf/user.props` 运行时覆盖默认文件的安装。

为此，在包含它的 docker-compose.yml 文件中更改 `datahub-frontend-react` 服务，使其包含自定义文件：

```yml
datahub-frontend-react：
    build：
      context: ../
      dockerfile: docker/datahub-frontend/Dockerfile
    image: acryldata/datahub-frontend-react:${DATAHUB_VERSION:-head}
    env_file: datahub-frontend/env/docker.env
    hostname: datahub-frontend-react
    container_name: datahub-frontend-react
    ports：
      - “9002:9002”
    depends_on：
      - datahub-gms
    volumes：
      - ./my-custom-dir/user.props:/datahub-frontend/conf/user.props
```

然后针对你的组成文件运行 `docker-compose up`。

## 自定义 JaaS 配置

要更改默认的 JaaS 模块配置，必须启动 `datahub-frontend-react` 容器，并将自定义的 `jaas.conf` 文件作为卷挂载到
位置的自定义 `jaas.conf` 文件作为卷挂载到 `/datahub-frontend/conf/jaas.conf`。

为此，在包含该服务的 docker-compose.yml 文件中修改 `datahub-frontend-react` 服务，使其包含自定义文件：

```yml
datahub-frontend-react：
    build：
      context: ../
      dockerfile: docker/datahub-frontend/Dockerfile
    image: acryldata/datahub-frontend-react:${DATAHUB_VERSION:-head}
    env_file: datahub-frontend/env/docker.env
    hostname: datahub-frontend-react
    container_name: datahub-frontend-react
    ports：
      - “9002:9002”
    depends_on：
      - datahub-gms
    volumes：
      - ./my-custom-dir/jaas.conf:/datahub-frontend/conf/jaas.conf
```

然后针对你的编译文件运行 `docker-compose up`。
