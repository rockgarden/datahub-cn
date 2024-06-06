# GraphQL 入门

## 读取实体： 查询

DataHub 提供以下 `graphql` 查询，用于检索元数据图中的实体。

### 查询

下面的 `graphql` 查询可检索特定数据集的 `properties` 的 `urn` 和 `name`

```json
{
  dataset(urn: "urn:li:dataset:(urn:li:dataPlatform:kafka,SampleKafkaDataset,PROD)") {
    urn
    properties {
        name
    }
  }
}
```

除 URN 和属性外，您还可以获取资产的其他类型元数据，如实体的所有者、标记、域和术语。
有关详细信息，请参阅以下链接。”

- [查询数据集的所有者](/docs/api/tutorials/owners.md#read-owners)
- [查询数据集的标签](/docs/api/tutorials/tags.md#read-tags)
- [查询数据集的域](/docs/api/tutorials/domains.md#read-domains)
- [查询数据集的词汇表术语](/docs/api/tutorials/terms.md#read-terms)
- [查询数据集的折旧](/docs/api/tutorials/deprecation.md#read-deprecation)

### 搜索

要对特定类型的实体执行全文检索，请使用 search(input: `SearchInput!`) `graphql` 查询。
下面的 `graphql` 查询会搜索与特定查询项匹配的数据集。

```json
{
  search(input: { type: DATASET, query: "my sql dataset", start: 0, count: 10 }) {
    start
    count
    total
    searchResults {
      entity {
         urn
         type
         ...on Dataset {
            name
         }
      }
    }
  }
}
```

`search`字段用于表示我们要执行搜索。
`input`参数指定搜索条件，包括要搜索的实体类型、搜索查询词、搜索结果的起始索引和要返回的结果数。

`query`用于指定搜索词。
搜索词可以是简单的字符串，也可以是使用模式的更复杂的查询。

- `*` ：搜索所有实体。
- `*[string]`：搜索包含以指定的[string]开头的方面的所有实体。
- `[string]*`：搜索包含以指定的[string]结尾的方面的所有实体。
- `*[string]*`：搜索所有与命名为[string]的方面**匹配的实体。
- `[string]`：搜索包含指定的[string]的所有实体。

> 注意
  请注意，默认情况下，Elasticsearch 只允许通过搜索 API 对 10,000 个实体进行分页。
  如果需要分页更多，可以更改 Elasticsearch 中 `index.max_result_window` 设置的默认值，或者使用滚动 API 直接从索引中读取。


## 修改实体：突变

> 注意
    更改实体元数据的突变受[DataHub 访问策略](.../.../authorization/policies.md)约束。
    这意味着 DataHub 服务器将检查请求行为者是否被授权执行该操作。

要更新现有元数据实体，只需使用 `update<entityName>(urn: String!, input: EntityUpdateInput!)` GraphQL 查询。
例如，要更新仪表板实体，可以发出以下 GraphQL 变量：

```json
mutation updateDashboard {
    updateDashboard(
        urn: "urn:li:dashboard:(looker,baz)",
        input: {
            editableProperties: {
                description: "My new desription"
            }
        }
    ) {
        urn
    }
}
```

更多信息，请参阅以下链接。

- [添加标签](/docs/api/tutorials/tags.md#add-tags)
- [添加词汇表术语](/docs/api/tutorials/terms.md#add-terms)
- [添加域名](/docs/api/tutorials/domains.md#add-domains)
- [添加所有者](/docs/api/tutorials/owners.md#add-owners)
- [删除标签](/docs/api/tutorials/tags.md#remove-tags)
- [移除词汇表术语](/docs/api/tutorials/terms.md#remove-terms)
- [删除域名](/docs/api/tutorials/domains.md#remove-domains)
- [删除所有者](/docs/api/tutorials/owners.md#remove-owners)
- [更新旧版](/docs/api/tutorials/deprecation.md#update-deprecation)
- [编辑数据集的描述（即文档）](/docs/api/tutorials/descriptions.md#add-description-on-dataset)
- [编辑列上的描述（即文档）](/docs/api/tutorials/descriptions.md#add-description-on-column)
- [软删除](/docs/api/tutorials/datasets.md#delete-dataset)

请参阅 [Datahub API Comparison](/docs/api/datahub-apis_zh.md#datahub-api-比较) 浏览面向用例的指南。

## 处理错误

在 GraphQL 中，有错误的请求并不总是导致 non-200 HTTP 响应体。相反，错误会
会出现在顶层的 `errors` 字段中。

这样，客户端就能从容应对应用程序服务器返回的部分数据。
要验证发出 GraphQL 请求后没有错误返回，请确保同时检查返回的 `data` 和 `errors` 字段。

要捕捉 GraphQL 错误，只需检查 GraphQL 响应中的 `errors` 字段即可。它将包含一条信息、一个路径和一组扩展名
其中包含标准错误代码。

```json
{
  "errors": [
    {
      "message": "Failed to change ownership for resource urn:li:dataFlow:(airflow,dag_abc,PROD). Expected a corp user urn.",
      "locations": [
        {
          "line": 1,
          "column": 22
        }
      ],
      "path": ["addOwners"],
      "extensions": {
        "code": 400,
        "type": "BAD_REQUEST",
        "classification": "DataFetchingException"
      }
    }
  ]
}
```

正式支持以下错误代码：

| 代码 | 类型 | 描述 |
| - | - | - |
| 400 | BAD_REQUEST | 查询或突变是畸形的。|
| 403 | UNAUTHORIZED | 当前行为者无权执行请求的操作。|
| 404 | NOT_FOUND | 未找到资源。|
| 500 | SERVER_ERROR | 出现内部错误。检查服务器日志或联系 DataHub 管理员。|
