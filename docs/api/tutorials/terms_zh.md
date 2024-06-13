# Terms

## 为什么要在数据集上使用术语？

DataHub 中的业务词汇表（术语）功能可帮助您在组织内使用共享词汇表，方法是提供一个框架，用于定义一组标准化的数据概念，然后将它们与数据生态系统中存在的物理资产关联起来。

有关术语的更多信息，请参阅 [About DataHub Business Glossary](/docs/glossary/business-glossary_zh.md)。

### 本指南的目标

本指南将向您展示如何

- 创建：创建术语。
- 读取：读取附加到数据集的术语。
- 添加：向数据集的列或数据集本身添加术语。
- 删除：从数据集中删除术语。

## 先决条件

本教程需要部署 DataHub Quickstart 并摄取样本数据。
详细信息请参阅 [Datahub 快速入门指南](/docs/quickstart_zh.md)。

> 注意
在修改术语之前，您需要确保目标数据集已存在于您的 DataHub 实例中。
如果尝试操作不存在的实体，操作将失败。
在本指南中，我们将使用样本摄取的数据。

有关如何设置 GraphQL 的详细信息，请参阅 [How To Set Up GraphQL](/docs/api/graphql/how-to-set-up-graphql_zh.md)。

## 创建术语

以下代码创建了一个术语 `Rate of Return`。

```json
mutation createGlossaryTerm {
  createGlossaryTerm(input: {
    name: "Rate of Return",
    id: "rateofreturn",
    description: "A rate of return (RoR) is the net gain or loss of an investment over a specified time period."
  },
  )
}
```

如果看到以下回复，说明操作成功：

```python
{
  "data": {
    "createGlossaryTerm": "urn:li:glossaryTerm:rateofreturn"
  },
  "extensions": {}
}
```

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "mutation createGlossaryTerm { createGlossaryTerm(input: { name: \"Rate of Return\", id:\"rateofreturn\", description: \"A rate of return (RoR) is the net gain or loss of an investment over a specified time period.\" }) }", "variables":{}}'
```

预期答复：

```json
{
  "data": { "createGlossaryTerm": "urn:li:glossaryTerm:rateofreturn" },
  "extensions": {}
}
```

```python
{{ inline /metadata-ingestion/examples/library/create_term.py show_path_as_comment }}
```

### Expected Outcome of Creating Terms

You can now see the new term `Rate of Return` has been created.


<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/term-created.png"/>
</p>


We can also verify this operation by programmatically searching `Rate of Return` term after running this code using the `datahub` cli.

```shell
datahub get --urn "urn:li:glossaryTerm:rateofreturn" --aspect glossaryTermInfo

{
  "glossaryTermInfo": {
    "definition": "A rate of return (RoR) is the net gain or loss of an investment over a specified time period.",
    "name": "Rate of Return",
    "termSource": "INTERNAL"
  }
}
```

## 阅读术语

```json
query {
  dataset(urn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)") {
    glossaryTerms {
      terms {
        term {
          urn
          glossaryTermInfo {
            name
            description
          }
        }
      }
    }
  }
}
```

如果看到以下回复，说明操作成功：

```python
{
  "data": {
    "dataset": {
      "glossaryTerms": {
        "terms": [
          {
            "term": {
              "urn": "urn:li:glossaryTerm:CustomerAccount",
              "glossaryTermInfo": {
                "name": "CustomerAccount",
                "description": "account that represents an identified, named collection of balances and cumulative totals used to summarize customer transaction-related activity over a designated period of time"
              }
            }
          }
        ]
      }
    }
  },
  "extensions": {}
}
```

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "{dataset(urn: \"urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)\") {glossaryTerms {terms {term {urn glossaryTermInfo { name description } } } } } }", "variables":{}}'
```

预期答复：

````json
{"data":{"dataset":{"glossaryTerms":{"terms":[{"term":{"urn":"urn:li:glossaryTerm:CustomerAccount","glossaryTermInfo":{"name":"CustomerAccount","description":"account that represents an identified, named collection of balances and cumulative totals used to summarize customer transaction-related activity over a designated period of time"}}}]}}},"extensions":{}}```
````

```python
{{ inline /metadata-ingestion/examples/library/dataset_query_terms.py show_path_as_comment }}
```

## Add Terms

### Add Terms to a dataset

The following code shows you how can add terms to a dataset.
In the following code, we add a term `Rate of Return` to a dataset named `fct_users_created`.

```json
mutation addTerms {
    addTerms(
      input: {
        termUrns: ["urn:li:glossaryTerm:rateofreturn"],
        resourceUrn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)",
      }
  )
}
```

If you see the following response, the operation was successful:

```python
{
  "data": {
    "addTerms": true
  },
  "extensions": {}
}
```

</TabItem>
<TabItem value="curl" label="Curl">

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "mutation addTerm { addTerms(input: { termUrns: [\"urn:li:glossaryTerm:rateofreturn\"], resourceUrn: \"urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)\" }) }", "variables":{}}'
```

Expected Response:

```json
{ "data": { "addTerms": true }, "extensions": {} }
```

</TabItem>
<TabItem value="python" label="Python">

```python
{{ inline /metadata-ingestion/examples/library/dataset_add_term.py show_path_as_comment }}
```

</TabItem>
</Tabs>

### Add Terms to a Column of a Dataset

<Tabs>
<TabItem value="graphql" label="GraphQL">

```json
mutation addTerms {
    addTerms(
      input: {
        termUrns: ["urn:li:glossaryTerm:rateofreturn"],
        resourceUrn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)",
        subResourceType:DATASET_FIELD,
        subResource:"user_name"})
}
```

</TabItem>
<TabItem value="curl" label="Curl">

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "mutation addTerms { addTerms(input: { termUrns: [\"urn:li:glossaryTerm:rateofreturn\"], resourceUrn: \"urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)\", subResourceType: DATASET_FIELD, subResource: \"user_name\" }) }", "variables":{}}'
```

Expected Response:

```json
{ "data": { "addTerms": true }, "extensions": {} }
```

</TabItem>
<TabItem value="python" label="Python">

```python
{{ inline /metadata-ingestion/examples/library/dataset_add_column_term.py show_path_as_comment }}
```

</TabItem>
</Tabs>

### Expected Outcome of Adding Terms

You can now see `Rate of Return` term has been added to `user_name` column.


<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/term-added.png"/>
</p>


## Remove Terms

The following code remove a term from a dataset.
After running this code, `Rate of Return` term will be removed from a `user_name` column.

<Tabs>
<TabItem value="graphql" label="GraphQL" default>

```json
mutation removeTerm {
    removeTerm(
      input: {
        termUrn: "urn:li:glossaryTerm:rateofreturn",
        resourceUrn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)",
        subResourceType:DATASET_FIELD,
        subResource:"user_name"})
}
```

Note that you can also remove a term from a dataset if you don't specify `subResourceType` and `subResource`.

```json
mutation removeTerm {
    removeTerm(
      input: {
        termUrn: "urn:li:glossaryTerm:rateofreturn",
        resourceUrn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)",
      })
}
```

Also note that you can remove terms from multiple entities or subresource using `batchRemoveTerms`.

```json
mutation batchRemoveTerms {
    batchRemoveTerms(
      input: {
        termUrns: ["urn:li:glossaryTerm:rateofreturn"],
        resources: [
          { resourceUrn:"urn:li:dataset:(urn:li:dataPlatform:hdfs,SampleHdfsDataset,PROD)"} ,
          { resourceUrn:"urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)"} ,]
      }
    )
}
```

</TabItem>
<TabItem value="curl" label="Curl">

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "mutation removeTerm { removeTerm(input: { termUrn: \"urn:li:glossaryTerm:rateofreturn\", resourceUrn: \"urn:li:dataset:(urn:li:dataPlatform:hdfs,SampleHdfsDataset,PROD)\" }) }", "variables":{}}'
```

</TabItem>
<TabItem value="python" label="Python">

```python
{{ inline /metadata-ingestion/examples/library/dataset_remove_term_execute_graphql.py show_path_as_comment }}
```

</TabItem>
</Tabs>

### Expected Outcome of Removing Terms

You can now see `Rate of Return` term has been removed to `user_name` column.


<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/term-removed.png"/>
</p>

