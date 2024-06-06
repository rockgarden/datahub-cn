# [Mutations](https://datahubproject.io/docs/graphql/mutations)

## createIngestionExecutionRequest

类型：String

创建执行摄取任务输入的请求： 创建摄取执行请求所需的输入

`mutation createIngestionExecutionRequest`

参数

|名称 |描述 |
|-|-|
|input [CreateIngestionExecutionRequestInput!](https://datahubproject.io/docs/graphql/inputObjects#createingestionexecutionrequestinput)| |

```json
variables: {input: {ingestionSourceUrn: "urn:li:dataHubIngestionSource:7f499d40-e948-4116-b48f-a92f6027d13c"}}
```

## createIngestionSource

类型：String

创建新的摄取源

参数

|名称 |描述 |
|-|-|
|input [UpdateIngestionSourceInput!](https://datahubproject.io/docs/graphql/inputObjects#updateingestionsourceinput)| |
