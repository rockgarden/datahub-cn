---
标题： 元数据模型
sidebar_label： 元数据模型
slug： /metadata-modeling/metadata-model
---

# DataHub 如何对元数据建模？

DataHub 采用模式优先的方法为元数据建模。我们使用开源的 Pegasus 模式语言（[PDL](https://linkedin.github.io/rest.li/pdl_schema)），并通过自定义注释集进行扩展，以建立元数据模型。DataHub 的存储、服务、索引和摄取层直接在元数据模型之上运行，并支持从客户端到存储层的所有强类型。

从概念上讲，元数据使用以下抽象概念建模

- 实体(Entities)：实体是元数据图中的主要节点。例如，数据集或公司用户的实例就是一个实体。实体由一个类型（如 “dataset”）、一个唯一标识符（如 “urn”）和一组元数据属性（如“documents”）组成，我们称之为方面。
- 方面(Aspects)：方面是描述实体某一特定方面的属性集合。它们是 DataHub 中最小的原子单元。也就是说，与同一实体相关的多个方面可以独立更新。例如，DatasetProperties 包含描述数据集的属性集合。各方面可在实体间共享，例如，“Ownership”就是一个可在所有拥有所有者的实体间重复使用的方面。常见的方面包括
  - [Ownership](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/Ownership.pdl)： 捕捉拥有实体的用户和组。
  - [globalTags](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/GlobalTags.pdl)： 捕捉与实体关联的标签的引用。
  - [glossaryTerms](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/GlossaryTerms.pdl)： 捕获与实体相关的词汇表术语的引用。
  - [institutionalMemory](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/InstitutionalMemory.pdl)： 捕捉与实体相关的公司内部文档（如links！）。
  - [status](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/Status.pdl)： 捕捉实体的 “deletion”状态，即是否应该软删除。
  - [subTypes](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/SubTypes.pdl)： 捕捉更通用实体类型的一个或多个 “sub types”。例如 “Looker Explore” 数据集、“View”数据集。特定的子类型可能意味着某个实体存在某些额外的方面。
- 关系(Relationships)： 关系代表 2 个实体之间的命名边。它们通过 Aspects 中的外键属性和自定义注解（@Relationship）来声明。关系允许双向遍历边缘。例如，图表可以通过名为 “OwnedBy” 的关系将公司用户称为其所有者。这条边可以从图表或公司用户实例开始走过。
- 标识符（键和瓮）(Identifiers (Keys & Urns))： 键是一种特殊类型的方面，包含唯一标识单个实体的字段。关键字可以序列化为 *Urns*，代表用于主键查找的关键字段的字符串化形式。此外，*Urns* 还可以转换回关键方面结构，从而使关键方面成为一种 “virtual” 方面。关键字方面为客户端提供了一种机制，使其可以轻松读取包含主键的字段，这些字段通常非常有用，如数据集名称、平台名称等。Urns 提供了一种友好的处理方式，通过它可以查询实体，而不需要完全实体化的结构。

下面是一个示例图，包含 3 种实体（CorpUser、Chart、Dashboard）、2 种关系（OwnedBy、Contains）和 3 种元数据（Ownership、ChartInfo 和 DashboardInfo）。

![metadata-model-chart](../pic/metadata-model-chart.png)

## 核心实体

DataHub 的 “core” 实体类型对组成现代数据栈的数据资产进行建模。它们包括

1. **[数据平台](docs/generated/metamodel/entities/dataPlatform.md)**： 一种数据“Platform”。即参与处理、存储或可视化数据资产的外部系统。例如 MySQL、Snowflake、Redshift 和 S3。

2. **[数据集](docs/generated/metamodel/entities/dataset.md)**： 数据集合。在 DataHub 上，表、视图、流、文档集和文件都被建模为 “dataset”。数据集可附加标签、所有者、链接、词汇表术语和描述。它们还可以有特定的子类型，如 “视图”、“集合”、“流”、“探索 ”等。例子包括 Postgres 表、MongoDB 集合或 S3 文件。
3. **[图表](docs/generated/metamodel/entities/chart.md)**： 从数据集导出的单一数据可视化。一个图表可以是多个仪表盘的一部分。图表可以附加标签、所有者、链接、术语表和描述。例如超级集或 Looker 图表。
4. **[仪表盘](docs/generated/metamodel/entities/dashboard.md)**： 用于可视化的图表集合。仪表盘可以附加标签、所有者、链接、术语表和说明。例如超级集或模式仪表盘。
5. **[数据任务](docs/generated/metamodel/entities/dataJob.md)**（Task）： 处理数据资产的可执行任务，其中 “processing” 意味着消耗数据、产生数据或两者兼而有之。数据任务可附加标签、所有者、链接、术语表和描述。它们必须属于一个数据流。例如气流任务。
6. **[数据流](docs/generated/metamodel/entities/dataFlow.md)**（Pipeline）：数据任务的可执行集合，它们之间有依赖关系，或者说是一个 DAG(Directed Acyclic Graph, 有向无环图)。数据任务可附加标签、所有者、链接、术语表和描述。例如Airflow DAG。

请参阅在线文档**元数据建模/实体**部分，探索整个模型。

## 实体注册表

DataHub 在何处定义实体及其方面？元数据模型 “住” 在哪里？
元数据模型是通过实体注册表(Entity Registry)拼接在一起的，实体注册表是构成元数据图的实体以及与每个实体相关的方面的目录。
简单地说，这就是定义模型 “schema” 的地方。

传统上，实体注册表是使用 [快照(Snapshot)](../../metadata-models/src/main/pegasus/com/linkedin/metadata/snapshot) 模型构建的，这种模式明确地将实体与与之相关的方面联系在一起。
这种模式明确地将实体与与其相关的方面联系在一起。例如，[数据集快照(DatasetSnapshot)](../../metadata-models/src/main/pegasus/com/linkedin/metadata/snapshot/DatasetSnapshot.pdl)定义了核心 “数据集(Dataset)” 实体。
数据集实体的各个方面是通过特殊 “各个方面(Aspects)” 模式中的联合字段捕获的。示例如下 [DatasetAspect](../../metadata-models/src/main/pegasus/com/linkedin/metadata/aspect/DatasetAspect.pdl)。
该文件关联了数据集的特定方面（如 [DatasetProperties](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetProperties.pdl) ）和通用方面（如[Ownership](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/Ownership.pdl)、[机构内存(InstitutionalMemory)](../../metadata-models/src/main/pegasus/com/linkedin/common/InstitutionalMemory.pdl)、和 [Status](../../metadata-models/src/main/pegasus/com/linkedin/common/Status.pdl)）数据集实体。这种定义实体的方法很快将被淘汰，转而采用新的方法。

自 2022 年 1 月起，DataHub 已不再支持将快照模型作为添加新实体的手段。取而代之的是在名为 [entity-registry.yml](../../metadata-models/src/main/resources/entity-registry.yml) 的 YAML 配置文件中定义实体注册表，该文件在启动时提供给 DataHub 的元数据服务。该文件通过引用实体和方面的[名称(names)](../../metadata-models/src/main/pegasus/com/linkedin/common/Ownership.pdl#L7)来声明实体和方面。启动时，DataHub 会验证注册表文件的结构，并确保能找到与配置（通过 [@Aspect](../../metadata-models/src/main/pegasus/com/linkedin/common/Ownership.pdl#L6) 注解）提供的每个方面名称相关联的 PDL 模式。

采用这种格式后，元数据模型的演进变得更加容易。只需在 YAML 配置中添加实体和方面，而无需创建新的快照/方面(Snapshot/Aspect)文件。

## 探索 DataHub 的元数据模型

要探索当前的 DataHub 元数据模型，您可以查看这张高级图片，其中显示了不同的实体和它们之间的边缘，显示了它们之间的关系。

![datahub-metadata-model](../pic/datahub-metadata-model.png)

要浏览特定实体的方面模型并探索使用 “foreign-key” 概念的关系，您可以在我们的演示环境中查看它们，或浏览左侧 “**元数据建模/实体**”部分中自动生成的文档。

例如，以下是 DataHub 元数据模型中最常用实体的有用链接：

- [数据集](docs/generated/metamodel/entities/dataset.md)： [Profile](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Dataset,PROD)/Schema?is_lineage_mode=false) [Documentation](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Dataset,PROD)/Documentation?is_lineage_mode=false)
- [Dashboard](docs/generated/metamodel/entities/dashboard.md)：[简介](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Dashboard,PROD)/Schema?is_lineage_mode=false) [文档](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Dashboard,PROD)/Documentation?is_lineage_mode=false)
- [用户（又称 CorpUser）](docs/generated/metamodel/entities/corpuser.md)： [简介](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Corpuser,PROD)/Schema?is_lineage_mode=false) [文档](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,Corpuser,PROD)/Documentation?is_lineage_mode=false)
- [Pipeline (a.k.a DataFlow)](docs/generated/metamodel/entities/dataFlow.md)： [Profile](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,DataFlow,PROD)/Schema?is_lineage_mode=false) [Documentation](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,DataFlow,PROD)/Documentation?is_lineage_mode=false)
- [Feature Table (a.k.a. MLFeatureTable)](docs/generated/metamodel/entities/mlFeatureTable.md)： [Profile](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,MlFeatureTable,PROD)/Schema?is_lineage_mode=false) [Documentation](https://demo.datahubproject.io/dataset/urn:li:dataset:(urn:li:dataPlatform:datahub,MlFeatureTable,PROD)/Documentation?is_lineage_mode=false)

有关元数据模型中实体的完整列表，请浏览 [此处](https://demo.datahubproject.io/browse/dataset/prod/datahub/entities)，或使用左侧的**元数据建模/实体**部分。

### 为元数据模型生成文档

- 本网站： 本网站的元数据模型文档使用 `./gradlew :docs-website:yarnBuild` 生成，它将模型文档生成委托给 `metadata-ingestion` 模块中的 `modelDocGen` 任务。
- 将文档上传到正在运行的 DataHub 实例： 可使用命令 `./gradlew :metadata-ingestion:modelDocUpload` 生成元数据模型文档并上传到正在运行的 DataHub 实例。

***NOTE***：这将把模型文档上传到在环境变量 `$DATAHUB_SERVER` 中运行的 DataHub 实例（默认为 <http://localhost:8080>）。

## 查询元数据图

DataHub 的建模语言允许您优化元数据的持久性，以便与查询模式保持一致。

元数据图有三种支持的查询方式：主键查询、搜索查询和关系遍历。

> 刚接触 [PDL](https://linkedin.github.io/rest.li/pdl_schema) 文件？别着急。它们只是为 DataHub 中的各个方面定义 JSON 文档 “模式(schema)”的一种方法。所有输入到 DataHub 元数据服务的数据都根据 PDL 模式进行验证，每个 @Aspect 对应一个模式。从结构上看，PDL 与 [Protobuf](https://developers.google.com/protocol-buffers)非常相似，并可方便地映射为 JSON。

### 查询实体

#### 抓取最新实体方面（快照）

通过主键查询实体是指使用 “entities”（实体）端点，传入要检索的实体的主键。

例如，要获取图表实体，我们可以使用下面的 `curl`：

```bash
curl --location --request GET 'http://localhost:8080/entities/urn%3Ali%3Achart%3Acustomers
```

该请求将返回一组版本化的方面，每个方面都是最新版本。

你会注意到，我们使用与实体相关联的 url 编码 *Urn* 执行查找。
响应将是一条 “实体(Entity)” 记录，其中包含实体快照（反过来又包含与实体关联的最新方面(aspects)）。

#### 获取已版本化的方面

DataHub 还支持获取实体的单个元数据，我们称之为方面(aspects)。为此您需要提供实体的主键（urn）以及您要检索的方面名称和版本。

例如，要获取 Dataset 的 SchemaMetadata 方面的最新版本，您可以发出以下查询：

```bash
curl 'http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(urn%3Ali%3AdataPlatform%3Afoo%2Cbar%2CPROD)?aspect=schemaMetadata&version=0'

{
   "version":0,
   "aspect":{
      "com.linkedin.schema.SchemaMetadata":{
         "created":{
            "actor":"urn:li:corpuser:fbar",
            "time":0
         },
         "platformSchema":{
            "com.linkedin.schema.KafkaSchema":{
               "documentSchema":"{\"type\":\"record\",\"name\":\"MetadataChangeEvent\",\"namespace\":\"com.linkedin.mxe\",\"doc\":\"Kafka event for proposing a metadata change for an entity.\",\"fields\":[{\"name\":\"auditHeader\",\"type\":{\"type\":\"record\",\"name\":\"KafkaAuditHeader\",\"namespace\":\"com.linkedin.avro2pegasus.events\",\"doc\":\"Header\"}}]}"
            }
         },
         "lastModified":{
            "actor":"urn:li:corpuser:fbar",
            "time":0
         },
         "schemaName":"FooEvent",
         "fields":[
            {
               "fieldPath":"foo",
               "description":"Bar",
               "type":{
                  "type":{
                     "com.linkedin.schema.StringType":{
                        
                     }
                  }
               },
               "nativeDataType":"string"
            }
         ],
         "version":0,
         "hash":"",
         "platform":"urn:li:dataPlatform:foo"
      }
   }
}
```

#### 获取时间序列方面

DataHub 支持用于获取实体的一组时间序列方面的 API。例如，您可能希望使用此 API
获取有关数据集的最近剖析运行和统计数据。为此，您可以对 `/aspects` 端点发出 “get” 请求。

例如，要获取数据集的数据集剖析（即统计数据），您可以发出以下查询：

```bash
curl -X POST 'http://localhost:8080/aspects?action=getTimeseriesAspectValues' \
--data '{
    "urn": "urn:li:dataset:(urn:li:dataPlatform:redshift,global_dev.larxynx_carcinoma_data_2020,PROD)",
    "entity": "dataset",
    "aspect": "datasetProfile",
    "startTimeMillis": 1625122800000,
    "endTimeMillis": 1627455600000
}'

{
   "value":{
      "limit":10000,
      "aspectName":"datasetProfile",
      "endTimeMillis":1627455600000,
      "startTimeMillis":1625122800000,
      "entityName":"dataset",
      "values":[
         {
            "aspect":{
               "value":"{\"timestampMillis\":1626912000000,\"fieldProfiles\":[{\"uniqueProportion\":1.0,\"sampleValues\":[\"123MMKK12\",\"13KDFMKML\",\"123NNJJJL\"],\"fieldPath\":\"id\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":3742},{\"uniqueProportion\":1.0,\"min\":\"1524406400000\",\"max\":\"1624406400000\",\"sampleValues\":[\"1640023230002\",\"1640343012207\",\"16303412330117\"],\"mean\":\"1555406400000\",\"fieldPath\":\"date\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":3742},{\"uniqueProportion\":0.037,\"min\":\"21\",\"median\":\"68\",\"max\":\"92\",\"sampleValues\":[\"45\",\"65\",\"81\"],\"mean\":\"65\",\"distinctValueFrequencies\":[{\"value\":\"12\",\"frequency\":103},{\"value\":\"54\",\"frequency\":12}],\"fieldPath\":\"patient_age\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":79},{\"uniqueProportion\":0.00820873786407767,\"sampleValues\":[\"male\",\"female\"],\"fieldPath\":\"patient_gender\",\"nullCount\":120,\"nullProportion\":0.03,\"uniqueCount\":2}],\"rowCount\":3742,\"columnCount\":4}",
               "contentType":"application/json"
            }
         },
      ]
   }
}
```

您会注意到，方面本身被序列化为转义 JSON。这是向更通用的读取/写入 API 的转变的一部分。
默认情况下，内容类型将是 JSON，而方面可以用您选择的语言反序列化为普通的 JSON 对象。请注意，这将很快成为写入和读取单个方面的事实方式。

### 搜索查询

搜索查询允许您搜索与任意字符串匹配的实体。

例如，要搜索与术语 “customers” 匹配的实体，我们可以使用下面的 CURL：

```bash
curl --location --request POST 'http://localhost:8080/entities?action=search' \                           
--header 'X-RestLi-Protocol-Version: 2.0.0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "input": "\"customers\"",
    "entity": "chart",
    "start": 0,
    "count": 10
}'
```

值得注意的参数是 `input` 和 `entity`，“input” 指定我们要发出的查询，”entity" 指定我们要搜索的实体类型。这是 @Entity 定义中定义的实体的通用名称。响应包含一个 Urns 列表，可用于获取完整的实体。

### 关系查询

通过关系查询，可以查找通过特定类型的边与特定源实体相连的实体。

例如，要查找某个图表的所有者，我们可以使用下面的 CURL：

```bash
curl --location --request GET --header 'X-RestLi-Protocol-Version: 2.0.0' 'http://localhost:8080/relationships?direction=OUTGOING&urn=urn%3Ali%3Achart%3Acustomers&types=List(OwnedBy)'
```

值得注意的参数是`direction`、`urn`和`types`。响应包含与主实体（`urn:li:chart:customer`）通过名为 “OwnedBy” 的关系连接的所有实体相关的 *Urns。也就是说，它允许获取给定图表的所有者。

#### 特殊方面

有几个特殊方面值得一提：

1. 关键方面(Key aspects)：包含唯一标识实体的属性。
2. 浏览路径方面(Browse Paths aspect)：代表与实体相关联的分层路径。

#### 关键方面

如上所述，关键方面是结构/记录，包含唯一标识实体的字段。在字段方面有关键字段有一些限制：

- 所有字段必须是 STRING 或 ENUM 类型
- 所有字段必须是必填(REQUIRED)字段

键可以从 *Urns* 创建并转化为 *Urns*，后者代表键记录的字符串化版本。
用于进行转换的算法非常简单：键方面的字段会根据其索引（顺序）被替换成一个
字符串模板：

```aidl
// Case 1: # key fields == 1
urn:li:<entity-name>:key-field-1

// Case 2: # key fields > 1
urn:li:<entity-name>:(key-field-1, key-field-2, ... key-field-n) 
```

按照惯例，关键字段定义在 [metadata-models/src/main/pegasus/com/linkedin/metadata/key](../../metadata-models/src/main/pegasus/com/linkedin/metadata/key) 下。

##### 示例

CorpUser 可以通过 “username” 唯一标识，用户名通常对应于 LDAP 名称。

因此，它的 Key Aspect 定义如下：

```aidl
namespace com.linkedin.metadata.key

/**
 * Key for a CorpUser
 */
@Aspect = {
  "name": "corpUserKey"
}
record CorpUserKey {
  /**
  * The name of the AD/LDAP user.
  */
  username: string
}
```

其实体快照模型定义为

```aidl
/**
 * A metadata snapshot for a specific CorpUser entity.
 */
@Entity = {
  "name": "corpuser",
  "keyAspect": "corpUserKey"
}
record CorpUserSnapshot {

  /**
   * URN for the entity the metadata snapshot is associated with.
   */
  urn: CorpuserUrn

  /**
   * The list of metadata aspects associated with the CorpUser. Depending on the use case, this can either be all, or a selection, of supported aspects.
   */
  aspects: array[CorpUserAspect]
}
```

利用这些模型提供的信息组合，我们可以生成与靠谱用户相对应的Urn，如下所示

```aidl
urn:li:corpuser:<username>
```

假设我们有一个用户名为 “johnsmith” 的CorpUser实体。在这种情况下，与实体相关联的关键方面的 JSON 版本将是

```aidl
{
  "username": "johnsmith"
}
```

其对应的Urn将是

```aidl
urn:li:corpuser:johnsmith 
```

#### BrowsePaths 方面

BrowsePaths 方面允许您为实体定义自定义的 “浏览路径(browse path)”。浏览路径是分层组织实体的一种方式。
实体的一种方式。它们体现在用户界面的 “探索(Explore)” 功能中，允许用户浏览给定类型的相关实体树。

要支持浏览特定实体，请在 `entity-registry.yml` 文件中为实体添加 “browsePaths” 方面。

```aidl
/// entity-registry.yml 
entities:
  - name: dataset
    doc: Datasets represent logical or physical data assets stored or represented in various data platforms. Tables, Views, Streams are all instances of datasets.
    keyAspect: datasetKey
    aspects:
      ...
      - browsePaths
```

通过声明此方面，您可以生成自定义浏览路径，也可以使用类似下面的 CURL 手动查询浏览路径：

```aidl
curl --location --request POST 'http://localhost:8080/entities?action=browse' \
--header 'X-RestLi-Protocol-Version: 2.0.0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "path": "/my/custom/browse/path",
    "entity": "dataset",
    "start": 0,
    "limit": 10
}'
```

请注意，您必须提供

- 要获取结果的以“/”为分隔符的根路径。
- 使用通用名称的实体 “type”（上例中为 “dataset”）。

### Aspect类型

元数据方面有两种 “types”。这两种类型都使用 PDL 模式建模，并且都能以相同的方式被摄取。
但是，它们在表示的内容和 DataHub 元数据服务的处理方式上有所不同。

#### 1. 版本化的方面

每个版本化方面都有一个与之关联的**数字版本**。当方面中的字段发生变化时，新版本会自动创建并存储在 DataHub 后台。实际上，所有版本化的方面都存储在关系数据库中，可以备份和恢复。

可以备份和恢复。版本化功能为您习惯的用户界面体验提供了动力，包括所有权、描述、标签、术语等。例如所有权、全局标签和词汇表术语。

#### 2. 时间序列方面

时间序列方面（Timeseries Aspects）都有一个与之相关的**时间戳**。它们可用于表示时序事件。例如，剖析数据集的结果，或每天运行的一组数据质量检查。
每天运行。值得注意的是，时间序列方面不会在关系存储中持久化，而是只在搜索索引（如 elasticsearch）和消息队列（Kafka）中持久化。这使得在灾难情况下恢复时间序列方面
在灾难场景中恢复时间序列方面会面临更大的挑战。时间序列方面可以按时间范围进行查询，这也是它们与版本化方面最大的不同之处。
时间序列方面可以通过其 [@Aspect](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetProfile.pdl#L8) 注释中的 “timeseries” [type](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetProfile.pdl#L10)来识别。
示例包括 [DatasetProfile](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetProfile.pdl) 和 [DatasetUsageStatistics](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetUsageStatistics.pdl) 。

时间序列方面是具有 timestampMillis 字段的方面，适用于持续及时变化的方面，例如数据剖析。
及时变化的方面，如数据概况、使用统计等。

每个时间序列方面都必须声明为 "type": "timeseries"，并且必须
包含 [TimeseriesAspectBase](../../metadata-models/src/main/pegasus/com/linkedin/timeseries/TimeseriesAspectBase.pdl)，其中包含一个 timestampMillis 字段。

时间序列方面不能有任何带有 @Searchable 或 @Relationship 注解的字段，因为它要经过一个完全不同的流程。

请参考[数据集简介](../../metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetProfile.pdl)查看时间序列方面的示例。

由于时间序列方面会经常更新，因此对这些方面的摄取会直接进入弹性搜索（而不是存储在本地数据库中）。

您可以使用 “aspects?action=getTimeseriesAspectValues” 端点检索时间序列方面。

##### 可聚合的时间序列方面

对于此类数据（数据集概况、使用统计等）而言，能够在时间序列方面执行类似 SQL 的 *group by + aggregate* 操作是一个非常自然的用例。本节将介绍如何定义、摄取和执行针对时间序列方面的聚合查询。

###### 定义一个新的可聚合时间序列方面

*@TimeseriesField* 和 *@TimeseriesFieldCollection* 是两个新注解，可附加到 *Timeseries aspect* 的一个字段上。
这两个新注解可附加到 *Timeseries aspect* 的字段上，使其成为可聚合查询的一部分。这些
注释的字段允许的聚合类型取决于字段类型和聚合类型，如
此处]（#performing-an-aggregation-on-a-timeseries-aspect）所述。

- `@TimeseriesField = {}` - 此注解可用于任何类型的非集合类型字段，例如
  原始类型和记录（请参阅 *stat*、*strStat* 和 *strArray* 字段
  字段（见 [TestEntityProfile.pdl](https://github.com/datahub-project/datahub/blob/master/test-models/src/main/pegasus/com/datahub/test/TestEntityProfile.pdl) 中的 *stat*、*strStat* 和 *strArray* 字段）。

- `@TimeseriesFieldCollection {“key”:“<集合项类型的关键字段名>”}`注解允许
聚合支持（目前仅支持数组类型的集合），其中
key "的值是集合项目类型中的字段名称，该字段将用于指定分组子句（请参阅 *userCounts* 和 *userCounts*）。
见 [DatasetUsageStatistics.pdl](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/dataset/DatasetUsageStatistics.pdl) 中的 *userCounts* 和 *fieldCounts* 字段）。

除了用适当的 Timeseries 注释定义新的方面外、
实体-注册表.yml](<https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/resources/entity-registry.yml>)
文件也需要更新。只需将新方面名称添加到相应实体的方面列表下即可，如下所示，例如 “datasetUsageStatistics”（数据集使用情况统计）。
yaml
entities：

- name: 数据集
    keyAspect: datasetKey
    aspects：
  - datasetProfile
  - 数据集使用统计

```


###### 采集时间序列方面
可通过 GMS REST 端点`/aspects?action=ingestProposal`或 python API 采集时间序列方面。

示例 1： 使用 curl 通过 GMS REST API

``shell
curl --location --request POST 'http://localhost:8080/aspects?action=ingestProposal' \
--header 'X-RestLi-Protocol-Version: 2.0.0' \
--header 'Content-Type: application/json' （内容类型：应用程序/json
--data-raw '{
  “proposal” : {
    “entityType”： “dataset”、
    “entityUrn” : “urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)”、
    “changeType” : “UPSERT”、
    “aspectName” : “datasetUsageStatistics”、
    “方面”：{
      “value” : “{ timestampMillis\”:1629840771000,uniqueUserCount\“ : 10, totalSqlQueries\”： 20, fieldCounts\： [ {\“fieldPath\”： \count\： 20}, {\“fieldPath\” ： \count\： 5} ]}”,
      “contentType”： “application/json”
    }
  }
}'
```

示例 2：通过 Python API 连接 Kafka（或 REST）

```python
从 datahub.metadata.schema_classes import (
    ChangeTypeClass、
    DatasetFieldUsageCountsClass、
    DatasetUsageStatisticsClass、
)
from datahub.emitter.kafka_emitter import DatahubKafkaEmitter
from datahub.emitter.mcp import MetadataChangeProposalWrapper
从 datahub.emitter.rest_emitter 导入 DatahubRestEmitter

usageStats = DatasetUsageStatisticsClass(
            timestampMillis=1629840771000,
            uniqueUserCount=10、
            totalSqlQueries=20、
            字段计数=[
                DatasetFieldUsageCountsClass(
                    fieldPath=“col1”、
                    count=10
                )
            ]
        )

mcpw = MetadataChangeProposalWrapper(
    entityType=“dataset”、
    aspectName=“datasetUsageStatistics”、
    changeType=ChangeTypeClass.UPSERT、
    entityUrn=“urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)”、
    aspect=usageStats、
)

# 安装适当的发射器（kafka_emitter/rest_emitter）
# my_emitter = DatahubKafkaEmitter(“”“<config>””)
my_emitter = DatahubRestEmitter(“http://localhost:8080”)
my_emitter.emit(mcpw)
```

###### 在时间序列方面执行聚合

时间序列方面的聚合可通过 GMS REST API `/analytics?action=getTimeseriesStats`执行。
接受以下参数。
- `entityName` - 与该方面相关联的实体名称。
- `aspectName` - 方面的名称。
- `filter` - 执行分组和聚合前的任何预过滤标准。
- `metrics` - 聚合规范列表。聚合规范的 `fieldPath` 成员指的是
  字段名，而 `aggregationType` 则指定聚合的类型。
- `buckets` - 分组桶规范列表。每个分组桶都有一个 `key` 字段，指的是用于分组的字段。
  字段。类型 "字段指定分组桶的类型。

我们支持三种聚合，可在 Timeseries 注释字段的聚合查询中指定。
`aggregationType` 可以取以下值：

- `LATEST`： 每个数据桶中字段的最新值。支持任何类型的字段。
- `SUM`： 每个数据桶中字段的累计和。仅支持积分类型。
- `cardinality`： 每个数据桶中唯一值的数量或集合的卡入度。支持字符串和
  记录类型。

我们支持两种类型的分组，用于定义执行聚合的数据桶：

*`date_grouping_bucket`： 允许创建基于时间的数据桶，如按秒、分、小时、天、周、月、季度、年等、
  季度、年等。应与时间戳字段结合使用，时间戳字段的值是自 *epoch* 起的毫秒数。
  参数 `timeWindowSize` 指定了日期直方图的桶宽。
- `string_grouping_bucket`： 允许根据字段的唯一值创建分组桶。应始终与字符串类型字段
  应始终与字符串类型字段结合使用。

API 会返回一个类似 SQL 的通用表，作为输出的 `table` 成员，其中包含了
除了呼应输入参数外，该 API 还会返回一个类似于 SQL 表的通用表作为输出的 `table` 成员，其中包含 `group-by/aggregate` 查询的结果。

- columnNames：表列的名称。按组键名的显示顺序与请求中指定的顺序相同。
  的顺序排列。聚合规范按照请求中指定的相同顺序跟随分组字段、
  并命名为 `<agg_name>_<fieldPath>`。
- columnTypes：列的数据类型。
- `rows`: 数据值，每行对应相应的数据桶。

例如 每天最新的唯一用户数。

```shell

```

有关分组/聚合的复杂类型的更多示例，请参阅 [TimeseriesAspectServiceTestBase.java](https://github.com/datahub-project/datahub/blob/master/metadata-io/src/test/java/com/linkedin/metadata/timeseries/search/TimeseriesAspectServiceTestBase.java) 中 `getAggregatedStats` 组中的测试。
