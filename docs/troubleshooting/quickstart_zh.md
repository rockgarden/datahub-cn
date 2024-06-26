# 快速启动调试指南

当 [Quickstart](/docs/quickstart.md) 无法顺利运行时。

## 常见问题

1. Command not found: datahub

    如果运行 datahub cli 会在终端中产生 “command not found（找不到命令）”错误，则系统可能默认使用了较旧版本的 旧版本的 Python。请尝试在 `datahub` 命令前加上 `python3 -m`：

    ```bash
    python3 -m datahub docker quickstart
    ```

    另一种可能是你的系统 PATH 没有包含 pip 的 `$HOME/.local/bin` 目录。在 Linux 系统中，你可以将其添加到你的 `~/.bashrc` 目录中：

    ```bash
    if [ -d "$HOME/.local/bin" ] ; then
        PATH="$HOME/.local/bin:$PATH"
    fi
    ```

2. Port Conflicts

    默认情况下，快速启动部署要求本地计算机上的以下端口空闲：

    - 3306 用于 MySQL
    - 9200 用于 Elasticsearch
    - 9092 用于 Kafka 代理
    - 8081 用于模式注册中心
    - 用于 ZooKeeper 的 2181 端口
    - 9002 用于 DataHub Web 应用程序 (datahub-frontend)
    - 8080 用于 DataHub 元数据服务 (datahub-gms)

    如果默认端口与你已经在机器上运行的软件冲突，你可以通过向 `datahub docker quickstart` 命令传递额外的标志来覆盖这些端口。
    例如，要使用 53306（而不是默认的 3306）覆盖 MySQL 端口，可以使用 `datahub docker quickstart --mysql-port 53306`。使用 `datahub docker quickstart --help` 查看所有支持的选项。
    对于元数据服务容器（datahub-gms），你需要使用环境变量 `DATAHUB_MAPPED_GMS_PORT`。例如，要使用 58080 端口，你可以使用 `DATAHUB_MAPPED_GMS_PORT=58080 datahub docker quickstart` 。

3. no matching manifest for linux/arm64/v8 in the manifest list entries

    在使用 Apple Silicon（M1、M2 等）的 Mac 电脑上，你可能会看到类似 “no matching manifest for linux/arm64/v8 in the manifest list entries” 这样的错误，这通常意味着 datahub cli 无法检测到你是在 Apple Silicon 上运行它。要解决这个问题，可以通过发出 `datahub docker quickstart --arch m1` 来覆盖默认的架构检测。

4. Miscellaneous Docker issues

    Docker 可能会出现一些杂项问题，如容器冲突和卷悬空，这些问题通常可以通过使用以下命令修剪 Docker 状态来解决。请注意，该命令会删除所有未使用的容器、网络、映像（包括悬挂的和未引用的），并可选择删除卷。

    ```shell
    docker system prune
    ```

## 如何确认快速启动后所有 Docker 容器是否都按预期运行？

如果你设置了 `datahub` CLI 工具（参见 [此处](../../metadata-ingestion/README.md)），你可以使用内置的检查工具：

```shell
datahub docker check
```

你可以通过运行 `docker container ls` 列出本地的所有 Docker 容器。你应该会看到类似下面的日志：

```log
CONTAINER ID        IMAGE                                                 COMMAND                  CREATED             STATUS              PORTS                                                      NAMES
979830a342ce        acryldata/datahub-mce-consumer:latest                "bash -c 'while ping…"   10 hours ago        Up 10 hours                                                                    datahub-mce-consumer
3abfc72e205d        acryldata/datahub-frontend-react:latest              "datahub-frontend…"   10 hours ago        Up 10 hours         0.0.0.0:9002->9002/tcp                                     datahub-frontend
50b2308a8efd        acryldata/datahub-mae-consumer:latest                "bash -c 'while ping…"   10 hours ago        Up 10 hours                                                                    datahub-mae-consumer
4d6b03d77113        acryldata/datahub-gms:latest                         "bash -c 'dockerize …"   10 hours ago        Up 10 hours         0.0.0.0:8080->8080/tcp                                     datahub-gms
c267c287a235        landoop/schema-registry-ui:latest                     "/run.sh"                10 hours ago        Up 10 hours         0.0.0.0:8000->8000/tcp                                     schema-registry-ui
4b38899cc29a        confluentinc/cp-schema-registry:5.2.1                 "/etc/confluent/dock…"   10 hours ago        Up 10 hours         0.0.0.0:8081->8081/tcp                                     schema-registry
37c29781a263        confluentinc/cp-kafka:5.2.1                           "/etc/confluent/dock…"   10 hours ago        Up 10 hours         0.0.0.0:9092->9092/tcp, 0.0.0.0:29092->29092/tcp           broker
15440d99a510        docker.elastic.co/kibana/kibana:5.6.8                 "/bin/bash /usr/loca…"   10 hours ago        Up 10 hours         0.0.0.0:5601->5601/tcp                                     kibana
943e60f9b4d0        neo4j:4.0.6                                           "/sbin/tini -g -- /d…"   10 hours ago        Up 10 hours         0.0.0.0:7474->7474/tcp, 7473/tcp, 0.0.0.0:7687->7687/tcp   neo4j
6d79b6f02735        confluentinc/cp-zookeeper:5.2.1                       "/etc/confluent/dock…"   10 hours ago        Up 10 hours         2888/tcp, 0.0.0.0:2181->2181/tcp, 3888/tcp                 zookeeper
491d9f2b2e9e        docker.elastic.co/elasticsearch/elasticsearch:5.6.8   "/bin/bash bin/es-do…"   10 hours ago        Up 10 hours         0.0.0.0:9200->9200/tcp, 9300/tcp                           elasticsearch
ce14b9758eb3        mysql:8.2
```

您还可以通过运行 `docker logs <<container_name>>` 查看单个 Docker 容器的日志。对于 `datahub-gms`，你应该在初始化结束时看到类似下面的日志：

```log
2020-02-06 09:20:54.870:INFO:oejs.Server:main: Started @18807ms
```

对于 `datahub-frontend-react`，在初始化结束时，你应该会看到类似下面的日志：

```log
09:20:22 [main] INFO  play.core.server.AkkaHttpServer - Listening for HTTP on /0.0.0.0:9002
```

## 我的 elasticsearch 或 broker 容器退出时出错或永远卡住了

如果你看到类似下面的错误，很可能是你没有给 docker 分配足够的资源。请确保至少分配 8GB 内存 + 2GB 交换空间。

```log
datahub-gms             | 2020/04/03 14:34:26 Problem with request: Get http://elasticsearch:9200: dial tcp 172.19.0.5:9200: connect: connection refused. Sleeping 1s
broker                  | [2020-04-03 14:34:42,398] INFO Client session timed out, have not heard from server in 6874ms for sessionid 0x10000023fa60002, closing socket connection and attempting reconnect (org.apache.zookeeper.ClientCnxn)
schema-registry         | [2020-04-03 14:34:48,518] WARN Client session timed out, have not heard from server in 20459ms for sessionid 0x10000023fa60007 (org.apache.zookeeper.ClientCnxn)
```

## 如何检查是否创建了[MXE](../what/mxe.md) Kafka主题？

你可以使用[kafkacat](https://github.com/edenhill/kafkacat)这样的工具来列出所有主题。
你可以运行下面的命令查看在你的 Kafka 代理中创建的 Kafka 主题。

```bash
kafkacat -L -b localhost:9092
```

确认除默认主题外，还存在 `MetadataChangeEvent`、`MetadataAuditEvent`、`MetadataChangeProposal_v1` 和 `MetadataChangeLog_v1` 主题。

## 如何检查 Elasticsearch 是否创建了搜索索引？

您可以运行以下命令查看 Elasticsearch 中创建的搜索索引。

```bash
curl http://localhost:9200/_cat/indices
```

确认除默认索引外，还存在 `datasetindex_v2` 和 `corpuserindex_v2` 索引。响应示例如下：

```bash
yellow open dataset_datasetprofileaspect_v1         HnfYZgyvS9uPebEQDjA1jg 1 1   0  0   208b   208b
yellow open datajobindex_v2                         A561PfNsSFmSg1SiR0Y0qQ 1 1   2  9 34.1kb 34.1kb
yellow open mlmodelindex_v2                         WRJpdj2zT4ePLSAuEvFlyQ 1 1   1 12 24.2kb 24.2kb
yellow open dataflowindex_v2                        FusYIc1VQE-5NaF12uS8dA 1 1   1  3 23.3kb 23.3kb
yellow open mlmodelgroupindex_v2                    QOzAaVx7RJ2ovt-eC0hg1w 1 1   0  0   208b   208b
yellow open datahubpolicyindex_v2                   luXfXRlSRoS2-S_tvfLjHA 1 1   0  0   208b   208b
yellow open corpuserindex_v2                        gbNXtnIJTzqh3vHSZS0Fwg 1 1   2  2 18.4kb 18.4kb
yellow open dataprocessindex_v2                     9fL_4iCNTLyFv8MkDc6nIg 1 1   0  0   208b   208b
yellow open chartindex_v2                           wYKlG5ylQe2dVKHOaswTww 1 1   2  7 29.4kb 29.4kb
yellow open tagindex_v2                             GBQSZEvuRy62kpnh2cu1-w 1 1   2  2 19.7kb 19.7kb
yellow open mlmodeldeploymentindex_v2               UWA2ltxrSDyev7Tmu5OLmQ 1 1   0  0   208b   208b
yellow open dashboardindex_v2                       lUjGAVkRRbuwz2NOvMWfMg 1 1   1  0  9.4kb  9.4kb
yellow open .ds-datahub_usage_event-000001          Q6NZEv1UQ4asNHYRywxy3A 1 1  36  0 54.8kb 54.8kb
yellow open datasetindex_v2                         bWE3mN7IRy2Uj0QzeCt1KQ 1 1   7 47 93.7kb 93.7kb
yellow open mlfeatureindex_v2                       fvjML5xoQpy8oxPIwltm8A 1 1  20 39 59.3kb 59.3kb
yellow open dataplatformindex_v2                    GihumZfvRo27vt9yRpoE_w 1 1   0  0   208b   208b
yellow open glossarynodeindex_v2                    ABKeekWTQ2urPWfGDsS4NQ 1 1   1  1 18.1kb 18.1kb
yellow open graph_service_v1                        k6q7xV8OTIaRIkCjrzdufA 1 1 116 25 77.1kb 77.1kb
yellow open system_metadata_service_v1              9-FKAqp7TY2hs3RQuAtVMw 1 1 303  0 55.9kb 55.9kb
yellow open schemafieldindex_v2                     Mi_lqA-yQnKWSleKEXSWeg 1 1   0  0   208b   208b
yellow open mlfeaturetableindex_v2                  pk98zrSOQhGr5gPYUQwvvQ 1 1   5 14 36.4kb 36.4kb
yellow open glossarytermindex_v2                    NIyi3WWiT0SZr8PtECo0xQ 1 1   3  8 23.1kb 23.1kb
yellow open mlprimarykeyindex_v2                    R1WFxD9sQiapIZcXnDtqMA 1 1   7  6 35.5kb 35.5kb
yellow open corpgroupindex_v2                       AYxVtFAEQ02BsJdahYYvlA 1 1   2  1 13.3kb 13.3kb
yellow open dataset_datasetusagestatisticsaspect_v1 WqPpDCKZRLaMIcYAAkS_1Q 1 1   0  0   208b   208b
```

## 如何检查数据是否已正确加载到 MySQL？

一旦 mysql 容器启动并运行，你就可以使用 [MySQL Workbench](https://www.mysql.com/products/workbench/) 等工具直接在 `localhost:3306` 连接到它。也可以运行以下命令，在 mysql 容器内调用 [MySQL 命令行客户端](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)。

```shell
docker exec -it mysql /usr/bin/mysql datahub --user=datahub --password=datahub
```

检查 `metadata_aspect_v2` 表的内容，其中包含所有实体的摄取方面。

## 启动 Docker 容器时出错

容器在初始化过程中失败可能有不同原因。以下是最常见的原因：

### `bind: address already in use`

该错误意味着网络端口（失败的容器本应使用该端口）已在系统中使用。在启动相应的 Docker 容器之前，您需要找到并杀死正在使用该特定端口的进程。如果不想杀死使用该端口的进程，另一个办法是更改 Docker 容器的端口号。你需要在 `docker-compose.yml` 配置文件中找到并更改特定 Docker 容器的 [ports](https://docs.docker.com/compose/compose-file/#ports) 参数。

```log
Example : On macOS

ERROR: for mysql  Cannot start service mysql: driver failed programming external connectivity on endpoint mysql (5abc99513affe527299514cea433503c6ead9e2423eeb09f127f87e2045db2ca): Error starting userland proxy: listen tcp 0.0.0.0:3306: bind: address already in use

   1) sudo lsof -i :3306
   2) kill -15 <PID found in step1>
```

### `OCI runtime create failed`

如果您看到类似下面的错误信息，请确保将您的本地版本库 git 更新为 HEAD。

```log
ERROR: for datahub-mae-consumer  Cannot start service datahub-mae-consumer: OCI runtime create failed: container_linux.go:349: starting container process caused "exec: \"bash\": executable file not found in $PATH": unknown
```

### `failed to register layer: devmapper: Unknown device`

这大多意味着磁盘空间不足（参见 [#1879](https://github.com/datahub-project/datahub/issues/1879)）。

### `ERROR: for kafka-rest-proxy  Get https://registry-1.docker.io/v2/confluentinc/cp-kafka-rest/manifests/5.4.0: EOF`

这很可能是 [Docker Registry](https://docs.docker.com/registry/) 的暂时性问题。稍后再重试。

## toomanyrequests: too many failed login attempts for username or IP address

试试以下方法

```bash
rm ~/.docker/config.json
docker login
```

关于同一问题的更多讨论 <https://github.com/docker/hub-feedback/issues/1250>

## Seeing `Table 'datahub.metadata_aspect' doesn't exist` error when logging in

这意味着数据库没有作为快速启动过程的一部分被正确初始化（参见 [#1816](https://github.com/datahub-project/datahub/issues/1816)）。请运行以下命令手动初始化。

```shell
docker exec -i mysql sh -c 'exec mysql datahub -udatahub -pdatahub' < docker/mysql/init.sql
```

## 我搞砸了我的 docker 设置。如何从头开始？

运行以下脚本，删除在快速入门教程中创建的所有容器和卷。注意，你也会因此丢失所有数据。

```shell
datahub docker nuke
```

## 我在 DataHub GMS 容器中看到类似 "Caused by: java.lang.IllegalStateException： Duplicate key com.linkedin.metadata.entity.ebean.EbeanAspectV2@dd26e011". 我该怎么办？

这与 SQL 列整理问题有关。我们以前（2021 年 10 月 26 日之前）对 URN 字段使用的默认校对方式是不区分大小写（utf8mb4_unicode_ci）。我们最近部署时默认使用区分大小写的校对方式 (utf8mb4_bin)。要将 2021 年 10 月 26 日（v0.8.16 及以下版本）之前启动的部署更新为新的校对方式，您必须直接针对 SQL DB 运行此命令：

```log
ALTER TABLE metadata_aspect_v2 CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```

## 我修改了默认 user.props 文件，加入了自定义用户名和密码，但在 “Users & Groups” 选项卡中看不到新用户。为什么看不到？

目前，“user.props ”是 JAAS PropertyFileLoginModule 仅用于**身份验证**目的的文件。该文件不用作
摄取用户附加元数据的来源。为此，您需要使用 Rest.li API 或[基于文件的摄取源](../generated/ingestion/sources/file.md)摄取新用户的一些自定义信息。

有关摄取用户信息的文件示例，请查看 [single_mce.json](../../metadata-ingestion/examples/mce_files/single_mce.json)，它将单个用户对象摄取到 DataHub 中。请注意，提供的 “urn ”字段需要与您在 user.props 文件中提供的自定义用户名保持一致。例如，如果 user.props 文件包含

```props
my-custom-user:my-custom-password
```

要在 DataHub UI 中看到它，您需要摄取以下形式的元数据：

```json
{
  "auditHeader": null,
  "proposedSnapshot": {
    "com.linkedin.pegasus2avro.metadata.snapshot.CorpUserSnapshot": {
      "urn": "urn:li:corpuser:my-custom-user",
      "aspects": [
        {
          "com.linkedin.pegasus2avro.identity.CorpUserInfo": {
            "active": true,
            "displayName": {
              "string": "The name of the custom user"
            },
            "email": "my-custom-user-email@example.io",
            "title": {
              "string": "Engineer"
            },
            "managerUrn": null,
            "departmentId": null,
            "departmentName": null,
            "firstName": null,
            "lastName": null,
            "fullName": {
              "string": "My Custom User"
            },
            "countryCode": null
          }
        }
      ]
    }
  },
  "proposedDelta": null
}
```

## 配置了 OIDC，但无法登录。不断被重定向。该怎么办？

这种现象可能是由于 DataHub 用于验证用户的 Cookie 的大小造成的。如果 Cookie 过大（大于 4096），就会出现这种情况。Cookie 包含 OIDC 身份供应商返回的信息的编码版本--如果它们返回的信息很多，这可能是根本原因。

一种解决方案是使用 Play Cache 来持久化用户的会话信息。这意味着用户的属性（及其会话信息）将存储“datahub-frontend”服务的内存中，而不是浏览器端的cookie中。

要配置 Play Cache 会话存储，你可以把 `datahub-frontend` 容器的环境变量 “PAC4J_SESSIONSTORE_PROVIDER”设为 “PlayCacheSessionStore”。

请注意，使用 Play Cache 也有缺点。具体来说，它将使 `datahub-frontend` 成为有状态服务器。如果部署了多个 `datahub-frontend` 实例，就需要确保同一用户被确定地路由到同一个服务容器（因为会话存储在内存中）。如果使用的是 `datahub-frontend`（默认）的单个实例，那么一切都应该 “正常运行”。

更多详情，请参阅 <https://github.com/datahub-project/datahub/pull/5114>
