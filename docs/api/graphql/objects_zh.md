# [Objects](https://datahubproject.io/docs/graphql/objects)

## IngestionSource

摄取源实体

字段

|名称 |描述 |
|-|-|
|urn String!|摄入源的主键|
|type String!|源本身的类型，例如 mysql、bigquery、bigquery-usage。应与配方匹配。|
|name String!|摄取源的显示名称|
|schedule IngestionSchedule|与摄取源相关联的可选计划|
|platform DataPlatform|与该摄取源相关联的数据平台|
|config IngestionConfig!|摄取源的特定类型配置集|
|executions IngestionSourceExecutionRequests|以前执行摄取源的请求|
|config IngestionConfig!|摄取源的特定类型配置集：start Int，count Int|

## IngestionSourceExecutionRequests

与摄取源相关的执行请求

字段

|名称 |描述 |
|-|-|
|start Int|结果集的起始偏移量|
|count Int|要返回的结果数|
|total Int|结果集中的结果总数|
|executionRequests [ExecutionRequest!]|结果集中的执行请求对象|
