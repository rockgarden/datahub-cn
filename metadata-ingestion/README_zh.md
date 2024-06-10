# 元数据输入简介

> 提示 查找集成源
请参阅我们的 **[集成页面](https://datahubproject.io/integrations)** 浏览我们的摄取源，并根据其功能进行筛选。

## 集成方法

DataHub 提供三种数据摄取方法：

- 用户界面摄取： 通过用户界面轻松配置和执行元数据摄取管道。
- [CLI 摄取指南](cli-ingestion.md) ： 使用 YAML 配置摄取管道，并通过 CLI 执行。
- 基于 SDK 的摄取：使用 [Python Emitter](./as-a-library_zh.md) 或 [Java emitter](../metadata-integration/java/as-a-library_zh.md) 以编程方式控制摄取管道。

## 集成类型

集成可根据方法分为两种概念

### 基于推送的集成

当元数据发生变化时，基于推送的集成可让您直接从数据系统发射元数据。
基于推送的集成的例子包括 [Airflow](../docs/lineage/airflow.md)、[Spark](../metadata-integration/java/spark-lineage/README.md)、[Great Expectations](./integration_docs/great-expectations.md)和 [Protobuf Schemas](../metadata-integration/java/datahub-protobuf/README.md)。这样就能从数据生态系统中的 “active” 代理获得低延迟元数据集成。

### 基于拉的集成

基于拉动的集成允许您从数据系统中 “crawl” 或 “ingest” 元数据，方法是连接到数据系统并以批量或增量方式提取元数据。
基于拉的集成的示例包括 BigQuery、Snowflake、Looker、Tableau 等。

### 核心概念

以下是与摄取相关的核心概念：

- [Sources](source_overview.md)： 从中提取元数据的数据系统。（例如 BigQuery、MySQL）
- [Sinks](sink_overview.md)： 元数据的目的地（例如 File、DataHub）
- [Recipe](recipe_overview.md)： 以 .yaml 文件形式提供的主要摄取配置

有关更多高级指南，请参阅以下内容：

- [元数据摄取的开发](./developing.md)
- [添加元数据摄入源](./adding-source.md)
- [使用转换器](./docs/transformer/intro.md)
