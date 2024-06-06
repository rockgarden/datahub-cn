# [Inputs](https://datahubproject.io/docs/graphql/inputObjects)

## CreateIngestionExecutionRequestInput

用于创建执行请求输入的输入

参数

|名称 |描述 |
|-|-|
|ingestionSourceUrn String!| 要执行的摄取源的地址(Urn)|

## UpdateIngestionSourceInput

用于创建/更新摄入源的输入参数

参数

|名称 |描述 |
|-|-|
|name String!|与摄取源相关的名称|
|type String!|源本身的类型，如 mysql、bigquery、bigquery-usage。应与配方匹配。|
|description String!|与摄取源相关的可选描述|
|schedule [UpdateIngestionSourceScheduleInput](#updateingestionsourcescheduleinput)|摄取源的可选计划。如果未提供，该源只能按需运行。|
|config [UpdateIngestionSourceConfigInput!](#updateingestionsourceconfiginput)|一组特定类型的摄取源配置|

## UpdateIngestionSourceScheduleInput

用于创建/更新摄入源计划的输入参数

参数

|名称 |描述 |
|-|-|
|interval String!|描述任务执行时间的 cron 格式间隔|
|timezone String!|应安排 cron 时间间隔的时区名称（如美国/洛杉矶）|

## UpdateIngestionSourceConfigInput

用于创建/更新摄入源的输入参数

参数

|名称 |描述 |
|-|-|
|recipe String!|一个 JSON 编码的配方|
|version String|执行配方时要使用的 DataHub Ingestion Framework 版本。|
|executorId String!|执行配方时要使用的执行器 id|
|debugMode Boolean|是否以调试模式运行摄取|
|extraArgs [StringMapEntryInput!](#stringmapentryinput)|用于运行摄取的额外参数。|

## StringMapEntryInput

字符串地图条目输入

参数

|名称 |描述 |
|-|-|
|key String!|Map条目的键值|
|value String|Map条目的值|
