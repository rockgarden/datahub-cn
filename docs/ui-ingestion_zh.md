# 摄入

## 简介

从版本 `0.8.25`开始，DataHub 支持使用 DataHub 用户界面创建、配置、调度和执行批量元数据摄取。这使得
将操作自定义集成管道所需的开销降至最低，从而更轻松地将元数据导入 DataHub。

本文档将介绍在用户界面内配置、调度和执行元数据摄取所需的步骤。

## 运行元数据摄取

### 前提条件

要查看和管理基于用户界面的元数据摄取，您的账户必须拥有 “管理元数据摄取 ”和 “管理机密 ”权限。这些权限可通过[平台策略]（authorization/policies.md）授予。

[ingestion-privileges](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/ingestion-privileges.png)

拥有这些权限后，您就可以通过导航到 DataHub 中的 “Ingestion” 选项卡开始管理摄取。

在此页面上，您将看到活动**消化源**的列表。摄取源是摄取到 DataHub 的元数据的唯一来源。
从 Snowflake、Redshift 或 BigQuery 等外部源摄取到 DataHub 的唯一元数据源。

如果您刚刚开始使用，则不会有任何源。在以下章节中，我们将介绍如何创建您的第一个**摄取源**。

### 创建摄取源

#### UI

在摄取任何元数据之前，你需要创建一个新的摄取源。首先点击 **+ Create new source**.

1. 选择平台模板

    第一步，选择与要提取元数据的源类型相对应的**Recipe Template**。从 Snowflake 到 Postgres 再到 Kafka 等各种本地支持的集成中进行选择。
    选择 “Custom”，从头开始构建摄取配方。

    接下来，你将配置一个摄取**配方(Recipe)**，它定义了从源系统中提取的_how_方式和_what_内容。

2. 配置配方

    接下来，你将在 [YAML](https://yaml.org/) 中定义一个摄取**配方**。[配方](https://datahubproject.io/docs/metadata-ingestion/#recipes) 是一组配置，用于
    DataHub 用于从第三方系统提取元数据的一组配置。它通常由以下部分组成：

    1. 源 **type**： 你想从中提取元数据的系统类型（如 snowflake、mysql、postgres）。如果您选择的是本地模板，则已为您填好。
    要查看当前支持的**type**的完整列表，请访问 [this list](https://datahubproject.io/docs/metadata-ingestion/#installing-plugins).

    2. 源**config**： 源**type**的一组特定配置。大多数源支持以下类型的配置值：
        - **Coordinates**： 要提取元数据的系统位置
        - **Credentials**： 访问要提取元数据的系统的授权凭证
        - **Customizations**： 有关将提取的元数据的自定义设置，例如，要扫描关系数据库中的哪些数据库或表。

    3. sink**type**： 用于路由从源类型中提取的元数据的汇类型。官方支持的 DataHub sink 类型是 “datahub-rest” 和 “datahub-kafka”。

    4. sink**config**： 向所提供的汇类型发送元数据所需的配置。例如，DataHub 坐标和凭据。

    下图是为从 MySQL 采集元数据而配置的完整配方示例。

    ![example-mysql-recipe](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/example-mysql-recipe.png)

    每种源类型的详细配置示例和文档可在 [DataHub Docs](https://datahubproject.io/docs/metadata-ingestion/) 网站上找到。

    **创建秘密**

    对于生产用例，敏感的配置值（如数据库用户名和密码）应隐藏在摄取配方中，不被人发现、
    等敏感配置值应隐藏在摄取配方中，以防被人发现。为此，您可以创建并嵌入**Secrets**。秘密是命名为
    加密并存储在 DataHub 存储层中。

    要创建秘密，首先导航到 “Secrets”选项卡。然后单击 “+ Create new secret”。

    ![create-secret](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/create-secret.png)

    在表单中，为秘密提供一个唯一的名称、要加密的值以及一个可选的描述。完成后点击**Create**。
        这将创建一个秘密，可在摄取配方中使用其名称进行引用。

    **引用密文**

    一旦创建了秘密，就可以在配方中使用变量替换来引用它。例如，要在配方中替换 MySQL 用户名和密码的秘密，配方的定义如下：

    ```yml
    source:
        type: mysql
        config:
            host_port: 'localhost:3306'
            database: my_db
            username: ${MYSQL_USERNAME}
            password: ${MYSQL_PASSWORD}
            include_tables: true
            include_views: true
            profiling:
                enabled: true
    sink:
        type: datahub-rest
        config:
            server: 'http://datahub-gms:8080'
    ```

    从配方定义引用 DataHub Secrets

    执行此配方的摄取源时，DataHub 将尝试 “解析”在 YAML 中找到的秘密。如果可以解析秘密，则在执行前将引用替换为其解密值。秘密值在执行时间之后不会被持久化到磁盘上，也不会传输到 DataHub 外部。

    > 注意： 任何被授予管理密文平台权限的 DataHub 用户将能够使用 GraphQL API 检索明文密文值。

3. 安排执行

    接下来，您可以选择配置执行新摄取源的日程表。这样就可以根据企业的需求，以每月、每周、每天或每小时的频率安排元数据提取。
    日程表使用 CRON 格式定义。

    ![schedule-ingestion](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/schedule-ingestion.png)

    在洛杉矶时间每天上午 9:15 执行的摄取源

    要了解有关 CRON 调度格式的更多信息，请查阅 [维基百科](https://en.wikipedia.org/wiki/Cron) 概述。

    如果您计划临时执行摄取，可以单击 **Skip** 完全跳过调度步骤。别担心
    您可以随时回来更改。

4. 收尾

    最后，为您的摄取源命名。

    对配置满意后，单击 “Done” 保存更改。

##### 高级摄取配置

DataHub 的托管摄取用户界面预配置为使用与服务器兼容的最新版 DataHub CLI（[acryl-datahub](https://pypi.org/project/acryl-datahub/)）。
与服务器兼容。不过，您可以使用 “Advanced” 源配置覆盖默认软件包版本。

为此，只需单击 “Advanced”，然后更改 “CLI Version” 文本框，使其包含您要使用的 DataHub CLI 的确切版本。

![custom-ingestion-cli-version](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/custom-ingestion-cli-version.png)

将 CLI 版本锁定为 `0.8.23.2`

其他高级选项包括在运行时指定**environment variables**、**DataHub plugins**或**python packages at runtime**。

对更改满意后，只需点击 “Done” 即可保存。

#### CLI

您可以使用 cli 上传甚至更新[配方](./cli.md#ingest-deploy)，如 cli 文档中提到的上传摄取配方。给定 `recipe.yaml` 文件的执行示例如下

```bash
datahub ingest deploy --name "My Test Ingestion Source" --schedule "5 * * * *" --time-zone "UTC" -c recipe.yaml
```

这将创建一个名称为 “My Test Ingestion Source” 的新配方。请注意，要更新现有配方，必须将其 `urn` id 作为参数传递。
DataHub 支持使用相同名称的多个配方，因此为了区分它们，我们使用 urn 作为唯一标识。

#### GraphQL

使用 [DataHub 的 GraphQL API](./api/graphql/overview.md) 并使用 **createIngestionSource** 突变端点创建摄取源。

```graphql
mutation {
   createIngestionSource(input: {
      name: "My Test Ingestion Source",
      type: "mysql",
      description: "My ingestion source description",
      schedule: {interval: "*/5 * * * *", timezone: "UTC"},
      config: {
         recipe: "{\"source\":{\"type\":\"mysql\",\"config\":{\"include_tables\":true,\"database\":null,\"password\":\"${MYSQL_PASSWORD}\",\"profiling\":{\"enabled\":false},\"host_port\":null,\"include_views\":true,\"username\":\"${MYSQL_USERNAME}\"}},\"pipeline_name\":\"urn:li:dataHubIngestionSource:f38bd060-4ea8-459c-8f24-a773286a2927\"}",
         version: "0.8.18",
         executorId: "mytestexecutor",
      }
   })
}
```

要更新源，请使用 updateIngestionSource 端点。它与创建端点几乎完全相同，只需要更新源的 urn 以及与创建端点相同的输入。

> 注意：配方必须使用双引号转义。

### 运行摄入源

创建摄取源后，点击 “Execute” 即可运行。不久之后，您就会看到摄取源的 “Last Status” 列从 `N/A` 变为 `Running`。这意味着执行摄取的请求已被 DataHub 摄取执行器成功接收。

如果摄取已成功执行，则应看到绿色的 `Succeeded` 状态。

### 取消摄取运行

如果你的摄取运行挂起，可能是摄取源出现了错误，也可能是其他持久性问题，如指数超时。在这种情况下，你可以点击有问题运行上的 `Cancel` 来取消摄取。

取消后，可单击详细信息查看摄取运行的输出。

### 调试失败的摄取运行

导致摄取运行失败的原因有很多。常见的失败原因包括

1. 配方配置错误： 配方未提供摄取源所需或预期的配置。你可以参考元数据摄取框架源[文档](../metadata-ingestion/docs)，了解更多关于你的源类型所需的配置。
2. 无法解析机密：如果 DataHub 无法找到配方配置引用的机密，则摄取运行将失败。验证配方中引用的机密名称是否与已创建的机密名称一致。
3. 连接性/网络可达性： 如果 DataHub 无法访问数据源（例如，由于 DNS 解析失败），元数据摄取将失败。确保部署 DataHub 的网络可访问您尝试访问的数据源。
4. 身份验证： 如果已启用[元数据服务身份验证](/docs/authentication/introducing-metadata-service-authentication_zh.md)，则需要在配方配置中提供个人访问令牌。为此，请将汇配置的 `token` 字段设置为包含个人访问令牌：

![ingestion-with-token](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/ingestion-with-token.png)

每次运行的输出都会被捕获，并可在用户界面中查看，以方便调试。要查看输出日志，请单击相应摄取运行上的 DETAILS。

![ingestion-logs](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/ingestion-logs.png)

## 常见问题

1. 运行 “datahub docker quickstart” 后，我尝试摄取元数据，但摄取失败，出现了 “Failed to Connect” 的错误。我该怎么办？

    如果不是因为上述原因之一，这可能是因为运行摄取的执行器无法使用默认配置到达 DataHub 的后端。请尝试更改您的摄取配方，使 `sink.config.server` 变量指向 `datahub-gms` pod 的 Docker DNS 名称：

    ![quickstart-ingestion-config](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/quickstart-ingestion-config.png)

2. 尝试运行摄取时，我看到 “N/A”。我该怎么办？

    如果你看到 “N/A”，而且摄取的运行状态从未变为 “Running”，这可能意味着你的执行器（datahub-actions）容器宕机了。

    这个容器负责在收到运行摄取的请求时执行这些请求，或者根据特定计划按需执行。你可以使用 `docker ps` 验证容器的健康状况。此外，你还可以通过查找 `datahub-actions` 容器的容器 id 并运行 `docker logs <container-id>` 来检查容器日志。

3. 什么情况下不应该使用用户界面摄取？

    在某些情况下，可以不使用基于用户界面的摄取调度程序来摄取元数据。例如

    - 您编写了自定义摄取源
    - 在部署 DataHub 的网络上无法访问您的数据源。托管 DataHub 用户可使用[远程执行器](../docs/managed-datahub/operator-guide/setting-up-remote-ingestion-executor)进行基于用户界面的远程摄取。
    - 您的摄取源需要本地文件系统的上下文（如输入文件）
    - 您想在多个生产者/环境之间分配元数据摄取

4. 如何将策略附加到操作 pod 上，赋予它从不同来源获取元数据的权限？

    这因底层平台而异。对于 AWS，请参阅本[指南](../docs/deploy/aws#iam-policies-for-ui-based-ingestion)。
