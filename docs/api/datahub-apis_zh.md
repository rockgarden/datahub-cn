# 哪个 DataHub API 适合我？

DataHub 提供多个 API，用于在平台上操作元数据。这些是我们从多到少推荐的方法：

- 我们最推荐用于扩展和自定义 DataHub 实例行为的工具是我们在 [Python](metadata-ingestion/as-a-library.md) 和 [Java](metadata-integration/java/as-a-library.md)中的 SDK。
- 如果你想定制 DataHub 客户端或推出自己的客户端，[GraphQL API](docs/api/graphql/getting-started.md)将为我们的前端提供动力。我们认为，如果它对我们足够好，那么对每个人也足够好！如果 `graphql` 没有涵盖您使用案例中的所有内容，请访问 [我们的 slack](docs/slack.md)，让我们知道如何改进它！
- 如果你不太熟悉 `graphql`，而更愿意使用 OpenAPI，我们提供了 [OpenAPI](docs/api/openapi/openapi-usage-guide.md) 端点，允许你生成元数据事件和查询元数据。
- 最后，如果你是一个勇敢的人，并且非常清楚自己在做什么......你确定你不想直接使用 SDK 吗？如果你坚持使用，[Rest.li API](./restli/restli-overview.md)是一个功能更强大的低级 API，仅供高级用户使用。

## Python 和 Java SDK

我们为 Python 和 Java 提供了 SDK，在 CRUD 操作和您可能希望在 DataHub 中构建的任何复杂功能方面提供了完整的功能。

<a
    className='button button--primary button--lg'
    href=“/docs/metadata-ingestion/as-a-library”>
    开始使用 Python SDK
</a>

[开始使用 Java SDK](../../metadata-integration/java/as-a-library_zh.md)

## GraphQL API

`graphql` API 是该平台的主要公共 API。它可用于用您选择的语言以编程方式获取和更新元数据。该应用程序接口旨在简化最常见的操作。

[开始使用 GraphQL API](/docs/api/graphql/getting-started_zh.md)

## OpenAPI

适用于喜欢使用 OpenAPI 而非 GraphQL 进行编程操作的开发人员。为整个 DataHub 元数据模型的写入、读取和查询提供较低级别的 API 访问。

[开始使用 OpenAPI](/docs/api/openapi/openapi-usage-guide.md)

## Rest\.li API

> 注意事项
  Rest\.li API 仅适用于高级用户。如果您刚开始使用 DataHub，我们建议您使用 GraphQL API

Rest\.li API 代表底层持久层，并公开存储中使用的原始 PDL 模型。在引擎盖下，它为 GraphQL API 提供动力。除此之外，它还用于特定系统的元数据摄取，被元数据摄取框架用于将元数据直接推送到 DataHub。就所有意图和目的而言，Rest\.li API 被视为系统内部 API，这意味着 DataHub 组件是唯一可以直接使用此 API 的组件。

<a
    className='button button--primary button--lg'
    href=“/docs/api/restli/restli-overview”>
    开始使用我们的 Rest.li API
</a>

## DataHub API 比较

DataHub 支持多个 API，每个 API 都有自己独特的用法和格式。
以下是每个 API 的功能概览。

> 最后更新 ： 2024 年 2 月 16 日

| 功能 | GraphQL | Python SDK | OpenAPI |
| - | - | - | - |
| 创建数据集 | 🚫 | ✅ [指南](/docs/api/tutorials/datasets.md) | ✅ |
| 删除数据集（软删除） | ✅ [指南](/docs/api/tutorials/datasets.md#delete-dataset) | ✅ [指南](/docs/api/tutorials/datasets.md#delete-dataset) | ✅ |
| 删除数据集（硬删除） | 🚫 | ✅ [指南](/docs/api/tutorials/datasets.md#delete-dataset) | ✅ |
| 搜索数据集 | ✅ [指南](/docs/how/search.md#graphql) | ✅ | ✅ |
| 读取数据集弃用 | ✅ | ✅ | ✅ |
| 读取数据集实体 (V2) | ✅ | ✅ | ✅ |
| 创建标签 | ✅ [指南](/docs/api/tutorials/tags.md#create-tags) | ✅ [指南](/docs/api/tutorials/tags.md#create-tags) | ✅ |
| 读取标签 | ✅ [指南](/docs/api/tutorials/tags.md#read-tags) | ✅ [指南](/docs/api/tutorials/tags.md#read-tags) | ✅ |
| 将标签添加到数据集 | ✅ [指南](/docs/api/tutorials/tags.md#add-tags-to-a-dataset) | ✅ [指南](/docs/api/tutorials/tags.md#add-tags-to-a-dataset) | ✅ |
| 向数据集的列添加标签 | ✅ [指南](/docs/api/tutorials/tags.md#add-tags-to-a-column-of-a-dataset) | ✅ [指南](/docs/api/tutorials/tags.md#add-tags-to-a-column-of-a-dataset) | ✅ |
| 从数据集中删除标签 | ✅ [指南](/docs/api/tutorials/tags.md#remove-tags) | ✅ [指南](/docs/api/tutorials/tags.md#add-tags#remove-tags) | ✅ |
| 创建术语表术语 | ✅ [指南](/docs/api/tutorials/terms.md#create-terms) | ✅ [指南](/docs/api/tutorials/terms.md#create-terms) | ✅ |
| 从数据集读取术语 | ✅ [[指南]](/docs/api/tutorials/terms.md#read-terms) | ✅ [[指南]](/docs/api/tutorials/terms.md#read-terms) | ✅ |
| 向数据集的列添加术语 | ✅ [指南](/docs/api/tutorials/terms.md#add-terms-to-a-column-of-a-dataset) | ✅ [指南](/docs/api/tutorials/terms.md#add-terms-to-a-column-of-a-dataset) | ✅ |
| 将术语添加到数据集 | ✅ [[指南]](/docs/api/tutorials/terms.md#add-terms-to-a-dataset) | ✅ [[指南]](/docs/api/tutorials/terms.md#add-terms-to-a-dataset) | ✅ |
| 创建域 | ✅ [[指南]](/docs/api/tutorials/domains.md#create-domain) | ✅ [[指南]](/docs/api/tutorials/domains.md#create-domain) | ✅ |
| 读取域 | ✅ [[指南]](/docs/api/tutorials/domains.md#read-domains) | ✅ [[指南]](/docs/api/tutorials/domains.md#read-domains) | ✅ |
| 将域添加到数据集 | ✅ [[指南]](/docs/api/tutorials/domains.md#add-domains) | ✅ [[指南]](/docs/api/tutorials/domains.md#add-domains) | ✅ |
| 从数据集中删除域 | ✅ [指南](/docs/api/tutorials/domains.md#remove-domains) | ✅ [指南](/docs/api/tutorials/domains.md#remove-domains) | ✅ |
| 创建/删除用户 | ✅ [指南](/docs/api/tutorials/owners.md#upsert-users) | ✅ [指南](/docs/api/tutorials/owners.md#upsert-users) | ✅ |
| 创建/删除组 | ✅ [指南](/docs/api/tutorials/owners.md#upsert-users) | ✅ | |
| 创建/更新组 | ✅ [指南](/docs/api/tutorials/owners.md#upsert-group) | ✅ [指南](/docs/api/tutorials/owners.md#upsert-group) | ✅ |
| 读取数据集的所有者 | ✅ [指南](/docs/api/tutorials/owners.md#read-owners) | ✅ [指南](/docs/api/tutorials/owners.md#read-owners) | ✅ |
| 将所有者添加到数据集 | ✅ [指南](/docs/api/tutorials/owners.md#add-owners) | ✅ [指南](/docs/api/tutorials/owners.md#add-owners#remove-owners) | ✅ |
| 从数据集中删除所有者 | ✅ [指南](/docs/api/tutorials/owners#remove-owners) | ✅ [指南](https://datahubproject.io/docs/api/tutorials/owners) | ✅ |
| 添加列级 | ✅ [指南](/docs/api/tutorials/lineage.md) |✅ [指南](/docs/api/tutorials/lineage.md#add-lineage) | ✅ |
| 添加列级（细粒度）系谱 | 🚫 | ✅ [指南](docs/api/tutorials/lineage.md#add-column-level-lineage) | ✅ |
| 为数据集的列添加文档（描述） | ✅ [指南](/docs/api/tutorials/descriptions.md#add-description-on-column) | ✅ [指南](/docs/api/tutorials/descriptions.md#add-description-on-column) | ✅ |
| 在数据集上添加/删除/替换自定义属性 | 🚫 | ✅ [指南](/docs/api/tutorials/custom-properties.md) | ✅ |
| 将 ML 特征添加到 ML 特征表 | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#add-mlfeature-to-mlfeaturetable) | ✅ |
| 将 ML 特征添加到 MLModel | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#add-mlfeature-to-mlmodel) | ✅ |
| 将 ML 组添加到 MLFeatureTable | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#add-mlgroup-to-mlfeaturetable) | ✅ |
| 创建 MLFeature | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#create-mlfeature) | ✅ |
| 创建 MLFeatureTable | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#create-mlfeaturetable) | ✅ |
| 创建 MLModel | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#create-mlmodel) | ✅ |
| 创建 MLModelGroup | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#create-mlmodelgroup) | ✅ |
| 创建 MLPrimaryKey | 🚫 | ✅ [指南](/docs/api/tutorials/ml.md#create-mlprimarykey) | ✅ |
| 创建 MLFeatureTable | 🚫 | ✅ [[指南]](/docs/api/tutorials/ml.md#create-mlfeaturetable)| ✅ |
| 读取 MLFeature | ✅ [指南](/docs/api/tutorials/ml.md#read-mlfeature) | ✅ [指南](/docs/api/tutorials/ml.md#read-mlfeature) | ✅ |
| 读取 MLFeatureTable | ✅ [指南](/docs/api/tutorials/ml.md#read-mlfeaturetable) | ✅ [指南](/docs/api/tutorials/ml.md#read-mlfeaturetable) | ✅ |
| 读取 MLModel | ✅ [指南](/docs/api/tutorials/ml.md#read-mlmodel) | ✅ [指南](/docs/api/tutorials/ml.md#read-mlmodel) | ✅ |
| 读取 MLModelGroup | ✅ [指南](/docs/api/tutorials/ml.md#read-mlmodelgroup) | ✅ [指南](/docs/api/tutorials/ml.md#read-mlmodelgroup) | ✅ |
| 读取 MLPrimaryKey | ✅ [指南](/docs/api/tutorials/ml.md#read-mlprimarykey) | ✅ [指南](/docs/api/tutorials/ml.md#read-mlprimarykey) | ✅ |
| 创建数据产品 | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/create_dataproduct.py) | ✅ |
| 在图表和仪表板之间创建 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_chart_dashboard.py) | ✅ |
| 在数据集和图表之间创建 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_dataset_chart.py) | ✅ |
| 在数据集和 DataJob 之间创建 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_dataset_job_dataset.py) | ✅ |
| 为数据集创建细粒度线程作为 DataJob | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_datajob_finegrained.py) | ✅ |
| 为数据集创建精细世系 | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_dataset_finegrained.py) | ✅ |
| 使用 Kafka 创建数据集 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_kafka.py) | ✅ |
| 使用 MCPW 和 Rest Emitter 创建数据集 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_mcpw_rest.py) | ✅ |
| 使用 Rest Emitter 创建数据集 lineage | 🚫 | ✅ [代码](https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_rest.py) | ✅ |
| 使用数据流创建 DataJob | 🚫 | ✅ [代码](../../metadata-ingestion/examples/library/lineage_job_dataflow.py) [Simple](../../metadata-ingestion/examples/library/lineage_job_dataflow_new_api_simple.py) [Verbose](../../metadata-ingestion/examples/library/lineage_job_dataflow_new_api_verbose.py) | ✅ |
| 创建程序管道 | 🚫 | ✅ [代码](../../metadata-ingestion/examples/library/programatic_pipeline.py) | ✅ |
