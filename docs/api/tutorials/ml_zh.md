# ML系统

## 为什么要将 ML 系统与 DataHub 集成？

机器学习系统已成为现代数据堆栈的一项重要功能。
然而，机器学习系统不同组件（如特征、模型和特征表）之间的关系可能非常复杂。
DataHub 使这些关系可以被发现，并方便组织中的其他成员使用。

有关 ML 实体的技术细节，请参阅以下文档：

- [MlFeature](/docs/generated/metamodel/entities/mlFeature.md)
- [MlPrimaryKey](/docs/generated/metamodel/entities/mlPrimaryKey.md)
- [MlFeatureTable](/docs/generated/metamodel/entities/mlFeatureTable.md)
- [MlModel](/docs/generated/metamodel/entities/mlModel.md)
- [MlModelGroup](/docs/generated/metamodel/entities/mlModelGroup.md)

### 本指南的目标

本指南将向您展示如何

- 创建 ML 实体： MlFeature、MlFeatureTable、MlModel、MlModelGroup、MlPrimaryKey
- 读取 ML 实体： MlFeature、MlFeatureTable、MlModel、MlModelGroup、MlPrimaryKey
- 将 MlModel 附加到 MlFeature
- 将 MlFeatures 附加到 MlFeatureTable
- 将 MlFeatures 附加到支持它们的上游数据集

## 前提条件

对于本教程，您需要部署 DataHub Quickstart 并摄取样本数据。
有关详细步骤，请参阅 [Datahub 快速入门指南](/docs/quickstart.md)。

### 创建 ML 实体

### 创建 MLFeature

一个 ML 特征代表一个可用于不同机器学习模型的特征实例。特征被组织到特征表中，供机器学习模型使用。例如，如果我们为用户特征表建立特征模型，那么特征将包括 “年龄”、“注册日期”、“活跃期” 等。在 DataHub 中使用特征，用户可以查看特征生成的来源以及特征如何用于训练模型。

![python](/metadata-ingestion/examples/library/create_mlfeature.py)

请注意，创建特征时，您需要使用 `sources` 创建数据仓库的上游线路。

### 创建 MLPrimaryKey

ML 主键代表特征表中的一个特定元素，表示其他特征属于哪个组。例如，如果一个特征表包含用户特征，那么 ML 主键可能是 `user_id` 或类似的用户唯一标识符。在 DataHub 中使用 ML 主键可让用户指明 ML 特征表的结构。

![inline](/metadata-ingestion/examples/library/create_mlprimarykey.py)

请注意，创建主键时，应使用 `sources` 创建数据仓库的上游世系。

### 创建 MlFeatureTable

特征表代表一组类似的特征，这些特征可以一起用于训练模型。例如，如果有一个用户特征表，它将包含有关如何使用用户特征集合的文档，以及对每个特征和其中包含的 ML 主键的引用。

![inline](/metadata-ingestion/examples/library/create_mlfeature_table.py)

请注意，创建特征表时，应使用 `mlFeatures` 和 `mlPrimaryKeys` 将表与特征和主键连接起来。

### 创建 ML 模型

Acryl 中的 ML 模型代表训练有素的机器学习模型的一个单独版本。另一种理解 ML 模型实体的方式是将其视为训练运行的一个阶段。一个 ML 模型实体会跟踪训练实例中使用的确切 ML 特征以及训练结果。该实体并不代表 ML 模型的所有版本。例如，如果我们在某一天为主页定制训练一个模型，这将是 DataHub 中的一个 ML 模型。如果第二天根据新数据或使用不同参数重新训练模型，则会产生第二个 ML 模型实体。

![inline](/metadata-ingestion/examples/library/create_mlmodel.py)

请注意，创建模型时，您需要使用 `mlFeatures` 将其链接到特征列表。这表明模型的单个实例是如何训练的。
此外，您还可以使用`groups`访问模型组之间的关系。一个 ML 模型通过它对所读取的 ML 特征的依赖关系与它所依赖的仓库表相连。

### 创建 ML 模型组

一个 ML 模型组代表一个机器学习模型类别的所有训练运行的分组。它将存储有关 ML 模型组的文档，以及对每个单独 ML 模型实例的引用。

![inline](/metadata-ingestion/examples/library/create_mlmodel_group.py)

### 创建实体的预期结果

您可以在 DataHub UI 中搜索实体。

<p align=“center”>
  <img width=“100%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/feature-table-created.png”/>
</p>

<p align=“center”>
  <img width=“100%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/model-group-created.png”/> </p
</p>

### 读取 ML 实体

### 读取 MLFeature

```json
query {
  mlFeature(urn： “urn:li:mlFeature:(test_feature_table_all_feature_dtypes,test_BOOL_LIST_feature)”){
    名称
    特征命名空间
    描述
    属性 {
      描述
      数据类型
      版本 {
        版本标签
      }
    }
  }
}
```

预期响应：

```json
{
  “data”： {
    “mlFeature”： {
      “name”： “test_BOOL_LIST_feature”、
      “featureNamespace”： “test_feature_table_all_feature_dtypes”、
      “description”: null、
      属性 {
        “description”: null、
        “dataType”： “SEQUENCE”、
        “版本”：空
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“curl” label=“Curl” default>

```json
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization： Bearer <my-access-token>' \
--header 'Content-Type: application/json' （内容类型：应用程序/json
--data-raw '{
    “query”： “{ mlFeature(urn： \“urn:li:mlFeature:(test_feature_table_all_feature_dtypes,test_BOOL_LIST_feature)\”) { name featureNamespace description properties { description dataType version { versionTag } } } }”
}'
```

预期响应：

```json
{
  “data”： {
    “mlFeature”： {
      “name”： “test_BOOL_LIST_feature”、
      “featureNamespace”： “test_feature_table_all_feature_dtypes”、
      “description”: null、
      属性 {
        “description”: null、
        “dataType”： “SEQUENCE”、
        “版本”：空
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“python” label=“Python”>

```python
{{ inline /metadata-ingestion/examples/library/read_mlfeature.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 读取 MlPrimaryKey

<Tabs
<TabItem value=“graphql” label=“GraphQL” default>

``json
query {
  mlPrimaryKey(urn： “urn:li:mlPrimaryKey:(user_features,user_id)”){
    名称
    特征命名空间
    描述
    数据类型
    属性 {
      描述
      数据类型
      版本 {
        版本标签
      }
    }
  }
}

```

预期响应：

```json
{
  “data”： {
    “mlPrimaryKey”： {
      “name”： “user_id”、
      “featureNamespace”： “user_features”、
      “描述”： “用户的内部 ID”、
      “dataType”： “ORDINAL”、
      属性 {
        “description”： “用户内部 ID”、
        “dataType”： “ORDINAL”、
        “版本”：空
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“curl” label=“Curl” default>

```json
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization： Bearer <my-access-token>' \
--header 'Content-Type: application/json' （内容类型：应用程序/json
--data-raw '{
    “query”： “query { mlPrimaryKey(urn： \“urn:li:mlPrimaryKey:(user_features,user_id)\”){ name featureNamespace description dataType properties { description dataType version { versionTag }    }  }}”
}'
```

预期响应：

```json
{
  “data”： {
    “mlPrimaryKey”： {
      “name”： “user_id”、
      “featureNamespace”： “user_features”、
      “描述”： “用户的内部 ID”、
      “dataType”： “ORDINAL”、
      属性 {
        “description”： “用户内部 ID”、
        “dataType”： “ORDINAL”、
        “版本”：空
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“python” label=“Python”>

```python
{{ inline /metadata-ingestion/examples/library/read_mlprimarykey.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 读取 MLFeatureTable

<Tabs
<TabItem value=“graphql” label=“GraphQL” default>

``json
query {
  mlFeatureTable(urn： “urn:li:mlFeatureTable:(urn:li:dataPlatform:feast,test_feature_table_all_feature_dtypes)”){
    名称
    描述
    平台 {
      名称
    }
    属性 {
      描述
      mlFeatures {
        名称
      }
    }
  }
}

```

预期响应：

```json
{
  “data”： {
    “mlFeatureTable”： {
      “name”： “test_feature_table_all_feature_dtypes”、
      “description”: null、
      “平台”： {
        “名称”： “盛宴”
      },
      “属性”： {
        “description”: null、
        “mlFeatures”： [
          {
            “名称”： “test_BOOL_LIST_feature
          },
          ...{
            “名称”： “test_STRING_feature
          }
        ]
      }
    }
  },
  “扩展”： {}
}
```

``json
curl --location --request POST '<http://localhost:8080/api/graphql>' \
--header 'Authorization： Bearer <my-access-token>'\
--header 'Content-Type: application/json' （内容类型：应用程序/json
--data-raw '{
    “query”： “{ mlFeatureTable(urn： \“urn:li:mlFeatureTable:(urn:li:dataPlatform:feast,test_feature_table_all_feature_dtypes)\”) { name description platform { name } properties { description mlFeatures { name } } } }”
}'

```

预期响应：

``json
{
  “data”： {
    “mlFeatureTable”： {
      “name”： “test_feature_table_all_feature_dtypes”、
      “description”: null、
      “平台”： {
        “名称”： “盛宴”
      },
      “属性”： {
        “description”: null、
        “mlFeatures”： [
          {
            “名称”： “test_BOOL_LIST_feature
          },
          ...{
            “名称”： “test_STRING_feature
          }
        ]
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“python” label=“Python”>

```python
{{ inline /metadata-ingestion/examples/library/read_mlfeature_table.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 读取 MLM 模型

<Tabs
<TabItem value=“graphql” label=“GraphQL” default>

``json
query {
  mlModel(urn： “urn:li:mlModel:(urn:li:dataPlatform:science,scienceModel,PROD)”){
    名称
    描述
    属性 {
      描述
      版本
      类型
      mlFeatures
      组 {
        urn
        名称
      }
    }
  }
}

```

预期响应：

```json
{
  “data”： {
    “mlModel”： {
      “name”： “scienceModel”、
      “description”： “预测某种结果的样本模型”、
      “属性”： {
        “描述”： “预测某种结果的样本模型”、
        “版本”: null、
        “类型”： “Naive Bayes 分类器”、
        “mlFeatures”: null、
        “组”： []
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“curl” label=“Curl” default>

```json
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization： Bearer <my-access-token>' \
--header 'Content-Type: application/json' （内容类型：应用程序/json
--data-raw '{
    “query”： “{ mlModel(urn： \“urn:li:mlModel:(urn:li:dataPlatform:science,scienceModel,PROD)\”) { name description properties { description version type mlFeatures groups { urn name } } } }”
}'
```

预期响应：

``json
{
  “data”： {
    “mlModel”： {
      “name”： “scienceModel”、
      “description”： “预测某种结果的样本模型”、
      “属性”： {
        “描述”： “预测某种结果的样本模型”、
        “版本”: null、
        “类型”： “Naive Bayes 分类器”、
        “mlFeatures”: null、
        “组”： []
      }
    }
  },
  “扩展”： {}
}

```

</TabItem> 标签
<TabItem value=“python” label=“Python”>

```python
{{ inline /metadata-ingestion/examples/library/read_mlmodel.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 读取 MLModelGroup

<Tabs
<TabItem value=“graphql” label=“GraphQL” default>

``json
query {
  mlModelGroup(urn： “urn:li:mlModelGroup:(urn:li:dataPlatform:science,my-model-group,PROD)”){
    名称
    描述
    平台 {
      名称
    }
    属性 {
      描述
    }
  }
}

```

预期响应： (请注意，此实体在示例摄取中并不存在，您可能需要先创建此实体。）

```json
{
  “data”： {
    “mlModelGroup”： {
      “name”： “my-model-group”、
      “description”： “我的模型组”、
      “平台”： {
        “name”： “科学”
      },
      “属性”： {
        “description”： “我的模型组”
      }
    }
  },
  “扩展”： {}
}
```

</TabItem> 标签
<TabItem value=“curl” label=“Curl”>

```json
curl --location --request POST 'http://localhost:8080/api/graphql' \
--header 'Authorization： Bearer <my-access-token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    “query”： “{ mlModelGroup(urn： \“urn:li:mlModelGroup:(urn:li:dataPlatform:science,my-model-group,PROD)\”) { name description platform { name } properties { description } } }”
}'
```

预期响应： (请注意，此实体在样本摄取中并不存在，您可能需要先创建此实体。）

``json
{
  “data”： {
    “mlModelGroup”： {
      “name”： “my-model-group”、
      “description”： “我的模型组”、
      “平台”： {
        “name”： “科学”
      },
      “属性”： {
        “description”： “我的模型组”
      }
    }
  },
  “扩展”： {}
}

```

</TabItem> 标签
<TabItem value=“python” label=“Python”>

```python
{{ inline /metadata-ingestion/examples/library/read_mlmodel_group.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 添加 ML 实体

### 在 MlFeatureTable 中添加 MlFeature

<Tabs
<TabItem value=“python” label=“Python”>

``python
{{ inline /metadata-ingestion/examples/library/add_mlfeature_to_mlfeature_table.py show_path_as_comment }}

```

</TabItem> 标签
</Tabs

### 在 MLModel 中添加 MlFeature

<Tabs
<TabItem value=“python” label=“Python”>


``python
{{ inline /metadata-ingestion/examples/library/add_mlfeature_to_mlmodel.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 为 MLModel 添加 MLGroup

<Tabs
<TabItem value=“python” label=“Python”>

```python ”标签
{{ inline /metadata-ingestion/examples/library/add_mlgroup_to_mlmodel.py show_path_as_comment }}
```

</TabItem> 标签
</Tabs

### 添加 ML 实体的预期结果

您可以访问每个实体的 “特征 ”或 “组 ”选项卡，查看添加的实体。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/feature-added-to-model.png”/>
</p>

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/model-group-added-to-model.png”/> </p
</p>
