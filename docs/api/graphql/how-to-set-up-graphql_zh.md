# 如何设置 GraphQL

## 准备本地 Datahub 部署

要使用 GraphQL API，首先需要一个已部署的 DataHub 实例，并摄取一些元数据。
有关详细信息，请参阅 [Datahub 快速入门指南](/docs/quickstart.md)。

## 查询 GraphQL API

DataHub 的 GraphQL 端点服务于路径 `/api/graphql`，例如 `https://my-company.datahub.com/api/graphql`。
查询 GraphQL 端点时有几个选项。

用于**测试**：

- GraphQL Explorer (GraphiQL)
- CURL
- Postman

用于**生产**：

- 适用于所选语言的 GraphQL [Client SDK](https://graphql.org/code/)。
- 基本 HTTP 客户端

> 注意： DataHub GraphQL 端点目前仅支持 POST 请求。

### GraphQL Explorer (GraphiQL)

DataHub 提供基于浏览器的 GraphQL 浏览器工具（[GraphiQL](https://github.com/graphql/graphiql)），用于与 GraphQL API 进行实时交互。该工具的路径为 `/api/graphiql`（如 `https://my-company.datahub.com/api/graphiql`）。
通过该接口，您可以针对存储在实时 DataHub 部署中的真实元数据轻松创建查询和修改。

要在实时 DataHub 部署中部署 GraphiQL 之前试用它，可以访问 DataHub 提供的[演示网站](https://demo.datahubproject.io/api/graphiql)。
例如，您可以通过发布以下查询来创建标签：

```json
mutation createTag {
    createTag(input:
    {
      name: "Deprecated",
      description: "Having this tag means this column or table is deprecated."
    })
}
```

有关详细的使用指南，请查阅 [如何使用 GraphiQL](https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/)。

### CURL

CURL 是一种命令行工具，用于使用 HTTP、HTTPS 等各种协议传输数据。
要使用 CURL 查询 DataHub GraphQL API，您可以向 `/api/graphql` 端点发送 `POST` 请求，并在请求正文中包含 GraphQL 查询。
下面是一个通过 GraphQL API 创建标签的 CURL 命令示例：

```shell
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization: Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{ "query": "mutation createTag { createTag(input: { name: \"Deprecated\", description: \"Having this tag means this column or table is deprecated.\" }) }", "variables":{}}'
```

### Postman

Postman 是一款流行的 API 客户端，它提供了一个用于发送请求和查看响应的图形用户界面。
在 Postman 中，你可以创建一个 `POST` 请求，并将请求 URL 设为 `/api/graphql` 端点。
在请求正文中，选择 "GraphQL "选项，并在请求正文中输入 GraphQL 查询。

<p align="center">
  <img width="100%" src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/postman-graphql.png"/>
</p>

更多信息请参阅 Postman 文档中的 [Querying with GraphQL](https://learning.postman.com/docs/sending-requests/graphql/graphql-overview/)。

### 验证 + 授权

一般来说，在查询 GraphQL 时，您需要提供一个 [Access Token](../../authentication/personal-access-tokens.md)，方法是
提供包含 "Bearer" 令牌的 "Authorization"（授权）标头。头的格式如下

```bash
Authorization: Bearer <access-token>
```

对 GraphQL 端点暴露的操作的授权将根据发出请求的行为者来执行。
对于个人访问令牌，令牌将携带用户的权限。更多信息请参阅[访问令牌管理](/docs/api/graphql/token-management.md)。

## 下一步是什么？

现在你已经准备好使用 GraphQL 了，那么浏览一些使用案例如何？
更多信息请参阅[GraphQL 入门](/docs/api/graphql/getting-started.md)。
