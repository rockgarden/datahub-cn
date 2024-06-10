# 备份数据集线器

## 生产

建议的备份策略是定期转储数据库 `datahub.metadata_aspect_v2`，以便从转储中重新创建，大多数托管 DB 服务（如 AWS RDS）都支持这种做法。然后运行 [restore indices](./restore-indices.md) 重新创建索引。

为了备份 Time Series Aspects（支持使用和数据集配置文件），您必须备份 Elasticsearch，这可以通过 AWS OpenSearch 实现。否则，在发生灾难的情况下，您必须从您的数据源重新测试数据集配置文件！

## 快速启动

要备份 Quickstart，请参阅此 [文档](../quickstart_zh.md#backing-up-your-datahub-quickstart-experimental)，了解如何完成备份。
