---
标题 “使用 Docker 进行部署
hide_title: true
---

# Docker 映像

## 先决条件

你需要安装 [docker](https://docs.docker.com/install/) 和
[docker-compose](https://docs.docker.com/compose/install/)（如果使用 Linux；在 Windows 和 Mac 上，compose 包含在Docker Desktop）。

确保为 Docker 引擎分配足够的硬件资源。经过测试和确认的配置： 2 个 CPU、8GB RAM、2GB Swap 区域。

## 快速启动

启动和测试 DataHub 的最简单方法是使用 DataHub [Docker](https://www.docker.com) 镜像。
这些镜像会随着每次提交到版本库而持续部署到 [Docker Hub](https://hub.docker.com/u/linkedin)。

您可以通过我们的[快速入门指南](.../docs/quickstart.md)。

DataHub Docker 映像：

请勿在任何映像中使用 `latest` 或 `debug` 标记，因为这些标记不受支持，只是由于传统原因才会出现。请使用 `head` 或特定版本的标签，如 `v0.8.40`。对于生产，我们建议使用特定版本的标记，而不是 `head`。

* [acryldata/datahub-ingestion](https://hub.docker.com/r/acryldata/datahub-ingestion/)
* [acryldata/datahub-gms](https://hub.docker.com/repository/docker/acryldata/datahub-gms/)
* [acryldata/datahub-frontend-react](https://hub.docker.com/repository/docker/acryldata/datahub-frontend-react/)
* [acryldata/datahub-mae-consumer](https://hub.docker.com/repository/docker/acryldata/datahub-mae-consumer/)
* [acryldata/datahub-mce-consumer](https://hub.docker.com/repository/docker/acryldata/datahub-mce-consumer/)
* [acryldata/datahub-upgrade](https://hub.docker.com/r/acryldata/datahub-upgrade/)
* [acryldata/datahub-kafka-setup](https://hub.docker.com/r/acryldata/datahub-kafka-setup/)
* [acryldata/datahub-elasticsearch-setup](https://hub.docker.com/r/acryldata/datahub-elasticsearch-setup/)
* [acryldata/datahub-mysql-setup](https://hub.docker.com/r/acryldata/datahub-mysql-setup/)
* [acryldata/datahub-postgres-setup](https://hub.docker.com/r/acryldata/datahub-postgres-setup/)
* [acryldata/datahub-actions](https://hub.docker.com/r/acryldata/datahub-actions). 请勿使用 `acryldata/acryl-datahub-actions`，因为它已过时，不再使用。

依赖关系：

* [Kafka, Zookeeper, and Schema Registry](kafka-setup)
* [Elasticsearch](elasticsearch-setup)
* [MySQL](mysql)
* [Neo4j](neo4j)

### 接收演示数据

如果你想在 DataHub 启动后测试摄取一些数据，请使用 `./docker/ingestion/ingestion.sh` 脚本或 `datahub docker ingest-sample-data`。更多详情，请参阅 [quickstart guide](.../docs/quickstart.md)。

## 在开发过程中使用 Docker 镜像

请参阅 [在开发过程中使用 Docker 镜像](.../docs/docker/development_zh.md)。

### 构建和部署 Docker 镜像

我们使用 GitHub Actions 来构建和持续部署映像。不需要手动操作，在 Github 上成功发布后，就会自动发布映像。

#### 构建镜像

> 这并不是我们推荐的开发流程，大多数开发人员都应遵循开发过程中使用 [Docker 镜像](../docs/docker/development.md)指南。

要构建完整的映像（我们将要发布的映像），你需要运行以下程序：

```shell
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -p datahub build
```

这是因为我们依赖 buildkit 进行多阶段构建。将 `DATAHUB_VERSION` 设置为独特的版本也无妨。

### 社区构建的图像

随着开源项目的发展，社区成员也希望为 docker 镜像添加内容。并不是所有对镜像的贡献都能被接受，因为这些改动对所有社区成员都没有用，会增加构建时间、增加依赖性和可能的安全漏洞。在这种情况下，本节可用于指向由社区托管的 “Dockerfiles”，这些 “Dockerfiles” 建立在 DataHub 核心团队发布的映像之上，并指向维护这些映像结果的任何容器注册表链接。
