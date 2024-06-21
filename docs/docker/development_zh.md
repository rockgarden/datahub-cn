# 在开发过程中使用 Docker 镜像

我们创建了一个特殊的 [docker-compose.dev.yml](../../docker/docker-compose.dev.yml) 覆盖文件，用来配置 docker 镜像，使其在开发过程中更容易使用。

通常情况下，你会结合 gradle 和 docker compose 命令从头开始重建镜像。然而 这对开发来说耗时太长，而且需要推理好几层的 docker compose 配置 yaml 文件，这可能取决于你的硬件。

`docker-compose.dev.yml`文件绕过了通过挂载二进制文件、启动脚本和其他数据来重建 docker 映像的需要、 和其他数据。这些以 `debug` 标记的开发镜像将使用你通过 gradle 本地构建的代码。在本地构建并绕过重建 Docker 镜像的需要应该会更快。

我们强烈建议你直接调用 `./gradlew quickstartDebug` 任务。

该任务在 `docker/build.gradle` 中定义，执行以下步骤：

1. 构建运行 DataHub 所需的所有工件。这包括应用程序代码（如 GMS war）、包含 javascript 的前端压缩包（其中包含 javascript），以及辅助支持的 docker 容器。
2. 本地构建带有 docker compose 文件所需的预期 `debug` 标记的 Docker 映像。
3. 运行特殊的 `docker-compose.dev.yml` 和支持的 docker-compose 文件，将本地文件直接挂载到具有远程调试端口的容器中直接挂载本地文件，并启用远程调试端口。

一旦构建了 `debug` docker 镜像，你就会看到类似下面的镜像：

```shell
acryldata/datahub-frontend-react                 debug              e52fef698025   28 minutes ago   763MB
acryldata/datahub-kafka-setup                    debug              3375aaa2b12d   55 minutes ago   659MB
acryldata/datahub-gms                            debug              ea2b0a8ea115   56 minutes ago   408MB
acryldata/datahub-upgrade                       debug              322377a7a21d   56 minutes ago   463MB
acryldata/datahub-mysql-setup                   debug              17768edcc3e5   2 hours ago      58.2MB
acryldata/datahub-elasticsearch-setup            debug              4d935be7c62c   2 hours ago      26.1MB
```

此时，可以像通常使用 quickstart 一样，在 `http://localhost:9002` 查看 DataHub UI。

## 重新加载

接下来，执行所需的修改并重建前端 and/or GMS 组件。

构建 GMS：

```shell
./gradlew :metadata-service:war:build
```

构建前端：

包括 JavaScript 组件。

```shell
./gradlew :datahub-frontend:build
```

构建完工件后，只需重启容器即可使用更新后的代码运行。
重启可以使用 docker UI、docker cli 或下面的 gradle 任务。

```shell
./gradlew :docker:debugReload
```

## 启动/停止

以下命令可以暂停调试环境，在不需要时释放资源。

暂停容器并释放资源。

```shell
docker compose -p datahub stop
```

恢复容器，以便进一步调试。

```shell
docker compose -p datahub start
```

## 调试

默认调试程序使用本地代码，并默认启用 GMS 和前端的调试。通过
使用集成开发环境的 Remote Java Debugging（远程 Java 调试）功能附加到实例。

环境变量可控制 GMS 和前端的调试端口。

- `DATAHUB_MAPPED_GMS_DEBUG_PORT` - 默认值：5001
- `DATAHUB_MAPPED_FRONTEND_DEBUG_PORT` - 默认值： 5002

### IntelliJ 远程调试配置

截图显示了 IntelliJ 使用默认 GMS 调试端口 5001 的配置示例。

![intellij-remote-debug](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/development/intellij-remote-debug.png)

### 给 Docker 新手的提示

### 访问日志

强烈建议您使用 [Docker Desktop's dashboard](https://www.docker.com/products/docker-desktop) 访问服务日志。如果你双击一个图片，它就会为你调出日志。

#### 快速启动冲突

如果运行 quickstart，请使用 `./gradlew quickstartDebug` 返回到调试容器。

### Docker Prune

如果遇到磁盘空间问题，需要对镜像和容器进行修剪，则需要再次执行 `./gradlew quickstartDebug` 命令。

### 系统更新

在快速启动或生产环境中，“datahub-upgrade” 任务通常不会阻止其他容器的启动。通常，在进行需要重新索引 Elasticsearch 的更新时，需要执行此流程。如果需要重新索引，用户界面将会呈现，但可能会暂时返回错误，直到这项工作完成。

### 运行特定服务

`docker-compose up` 会启动配置中的所有服务，包括依赖项，除非它们已经在运行。如果你出于某种原因希望改变这种行为，请查看这些示例命令。

```shell
docker-compose -p datahub -f docker-compose.yml -f docker-compose.override.yml -f docker-compose-without-neo4j.m1.yml -f docker-compose.dev.yml up datahub-gms
```

只启动 `datahub-gms` 及其依赖项。

```shell
docker-compose -p datahub -f docker-compose.yml -f docker-compose.override.yml -f docker-compose-without-neo4j.m1.yml -f docker-compose.dev.yml up --no-deps datahub-gms
```

只启动 `datahub-gms`，不带依赖项。
