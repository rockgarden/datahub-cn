# Domains

从版本 `0.8.25`开始，DataHub 支持将数据资产分组到称为 **域(Domains)** 的逻辑集合中。域是经过策划的顶级文件夹或类别，相关资产可在其中明确分组。目前，一个资产一次只能属于一个域。

## 域设置、前提条件和权限

创建和添加域需要什么？

**管理域(Manage Domains)** 平台权限，用于在实体级别添加域

您可以通过创建新的[元数据策略](./authorization/policies.md)来创建此权限。

## 使用域

### 创建域

要创建域，请首先导航至 DataHub 右上角菜单中的 **域(Domains)** 选项卡。

<p align="center">
  <img width="100%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/domains-tab.png"/>
</p>

进入 "Domains" 页面后，您将看到在 DataHub 上创建的所有域的列表。此外，您还可以查看每个域内的实体数量。

要创建新域，请单击 "+ 新域(New Domain)"。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/create-domain.png"/>
</p>

在表单中，您可以为您的 "域" 选择一个名称。通常，这将与您的业务部门或小组相一致，例如 "平台工程" 或 "社交营销"。您还可以添加一个可选的描述。别担心，这可以稍后更改。

#### 高级：设置自定义域 id

单击 "高级"，显示设置自定义域 id 的选项。域 id 决定域在 DataHub "urn"（主键）中的显示内容。如果您打算在代码中使用通用名称来引用域，或者希望主键为人类可读，则此选项非常有用。请注意：一旦选择了自定义 id，就不能轻易更改。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/set-domain-id.png"/>
</p>

默认情况下，您无需为此担心。DataHub 将为您自动生成一个唯一的域 ID。

选择名称和描述后，单击 "创建" 以创建新域。

### 将资产分配到域

您可以使用用户界面将资产分配到 Domain，也可以使用 API 或在摄取过程中以编程方式将资产分配到 Domain。

### 基于用户界面的分配

要将资产分配到域，只需导航到资产的配置文件页面。在左侧底部菜单栏，你会看到一个 "域" 部分。单击 "设置域"，然后搜索要添加的域。完成后，点击 "添加"。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/set-domain.png"/>
</p>

要从域中删除资产，请单击域标签上的 "x" 图标。

> 注意： 从域中添加或删除资产需要 "编辑域" 元数据权限，该权限可通过[策略](authorization/policies.md)授予。

#### 摄取时间分配

所有基于 SQL 的摄取源都支持在摄取过程中使用 "域" 配置分配域。请查阅源的配置详情页面（例如 [Snowflake](./generated/ingestion/sources/snowflake.md)），以确认它是否支持域功能。

> 注意
  摄取过程中分配的域将覆盖您在用户界面中分配的域。一个表只能属于一个域。

下面是一个雪花摄取配方的快速示例，该配方经过增强，可将 **Analytics** 域附加到 **analytics** 模式中的 **long_tail_companions** 数据库中的所有表，并将 **Finance** 域附加到 **ecommerce** 模式中的 **long_tail_companions** 数据库中的所有表。

```yaml
source:
  type: snowflake
  config:
    username: ${SNOW_USER}
    password: ${SNOW_PASS}
    account_id: 
    warehouse: COMPUTE_WH
    role: accountadmin
    database_pattern:
      allow:
        - "long_tail_companions"
    schema_pattern:
      deny:
        - information_schema
    profiling:
      enabled: False
    domain:
      Analytics:
        allow:
          - "long_tail_companions.analytics.*"
      Finance:
        allow:
          - "long_tail_companions.ecommerce.*"
```

> 注
  当使用诸如 `Analytics`之类的裸域名时，摄取系统将首先检查类似 `urn:li:domain:Analytics` 的域是否已供应，如果没有，则将检查具有相同名称的已供应域。如果我们无法将裸域名解析为已供应的域，那么摄取将拒绝执行，直到该域已在 DataHub 上供应。

您也可以提供完全限定的域名，以确保无需在摄取时进行域名解析。例如，以下配方显示了一个使用完全限定域名的示例：

```yaml
source:
  type: snowflake
  config:
    username: ${SNOW_USER}
    password: ${SNOW_PASS}
    account_id:
    warehouse: COMPUTE_WH
    role: accountadmin
    database_pattern:
      allow:
        - "long_tail_companions"
    schema_pattern:
      deny:
        - information_schema
    profiling:
      enabled: False
    domain:
      "urn:li:domain:6289fccc-4af2-4cbb-96ed-051e7d1de93c":
        allow:
          - "long_tail_companions.analytics.*"
      "urn:li:domain:07155b15-cee6-4fda-b1c1-5a19a6b74c3a":
        allow:
          - "long_tail_companions.ecommerce.*"
```

### 按域搜索

创建域后，您可以使用搜索栏查找该域。

点击搜索结果将进入该域的个人资料，在这里可以编辑描述、添加/删除所有者以及查看域内资产。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/domain-entities.png"/>
</p>

将资产添加到域后，就可以使用左侧的搜索过滤器过滤搜索结果，将搜索范围限制在特定域内的资产。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/search-by-domain.png"/>
</p>

在主页上，您还可以找到组织内最受欢迎的域列表。

<p align="center">
  <img width="70%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/master//imgs/browse-domains.png"/>
</p>

## 其他资源

### GraphQL

* [domain](../graphql/queries.md#domain)
* [listDomains](../graphql/queries.md#listdomains)
* [createDomains](../graphql/mutations.md#createdomain)
* [setDomain](../graphql/mutations.md#setdomain)
* [unsetDomain](../graphql/mutations.md#unsetdomain)

#### 示例

创建域

```graphql
mutation createDomain {
  createDomain(input: { name: "My New Domain", description: "An optional description" })
}
```

该查询将返回一个 `urn`，您可以用它来获取域的详细信息。

## 创建嵌套域

```graphql
mutation createDomain {
  createDomain(input: { name: "Verticals", description: "An optional description", parentDomain: "urn:li:domain:marketing" })
}
```

此查询将在 "营销" 域下创建一个新域 "垂直"。

按Urn获取域

```graphql
query getDomain {
  domain(urn: "urn:li:domain:engineering") {
    urn
    properties {
        name 
        description
    }
    entities {
            total
    }
  }
}
```

将数据集添加到域

```graphql
mutation setDomain {
  setDomain(entityUrn: "urn:li:dataset:(urn:li:dataPlatform:hdfs,SampleHdfsDataset,PROD)", domainUrn: "urn:li:domain:engineering")
}
```

> 专业提示！您可以访问 `<your-datahub-url>/api/graphiql`，试用示例查询。

### 数据汇集博客

* [Just Shipped: UI-Based Ingestion, Data Domains & Containers, Tableau support, and MORE!](https://blog.datahubproject.io/just-shipped-ui-based-ingestion-data-domains-containers-and-more-f1b1c90ed3a)

## 常见问题和故障排除

DataHub 域、标签和词汇表术语之间有何区别？

DataHub 支持标签、词汇表术语和域，它们是适合特定用途的不同类型的元数据：

- **Tag**： 作为搜索和发现工具的非正式、松散控制的标签。资产可以有多个标签。没有正式的集中管理。
- **Glossary Terms**： 受控词汇，可选择层次结构。术语通常用于对叶级属性（即模式字段）的类型进行标准化管理。例如：(EMAIL_PLAINTEXT)
- **Domains**： 一组顶级类别。通常与资产最相关的业务单位/学科相一致。集中或分布式管理。每个数据资产分配一个域。

### Related Features

* [Glossary Terms](./glossary/business-glossary.md)
* [Tags](./tags.md)
