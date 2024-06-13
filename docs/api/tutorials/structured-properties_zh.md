# 结构化属性

## 为什么要使用结构化属性？

 结构化属性是一组结构化、命名的属性，可以附加到数据集、数据任务等逻辑实体上。
结构化属性的值是类型。从概念上讲，它们就像 “字段定义”。

有关结构化属性的更多信息，请参阅[结构化属性特性指南](../../../docs/features/feature-guides/properties_zh.md)。

### 本指南的目标

本指南将向您介绍如何使用结构化属性执行以下操作。

- 创建结构化属性
- 读取结构化属性
- 删除结构化属性（软删除）
- 向数据集添加结构化属性
- 修补结构化属性（添加/删除/更新单个属性）

## 前提条件

本教程需要部署 DataHub Quickstart 并摄取样本数据。
有关详细信息，请参阅 [Datahub 快速入门指南](/docs/quickstart.md)。

此外，根据您选择与 DataHub 交互的方法，您需要安装以下工具：

安装相关的 CLI 版本。表单从 CLI 版本 `0.13.1` 起可用。
通过 [init](https://datahubproject.io/docs/cli/#init) 连接到你的实例：

- 运行 `datahub init` 更新要加载到的实例。
- 将服务器设置为您的沙盒实例，即 `https://{your-instance-address}/gms`。
- 将令牌设置为访问令牌。

OpenAPI 的要求如下

- curl
- jq

## 创建结构化属性

以下代码将创建结构化属性 `io.acryl.privacy.retentionTime`。

创建一个 yaml 文件，代表你要加载的属性。
例如，下面的文件代表`io.acryl.privacy.retentionTime`属性。您可以查看完整示例：

![此处](../../../metadata-ingestion/examples/structured_properties/structured_properties.yaml)

使用 CLI 创建属性：

```commandline
datahub properties upsert -f {properties_yaml}
```

如果成功，你应该看到 `Created structured property urn:li:structuredProperty:...`

```commandline
curl -X 'POST' -v \
  'http://localhost:8080/openapi/v2/entity/structuredProperty/urn%3Ali%3AstructuredProperty%3Aio.acryl.privacy.retentionTime/propertyDefinition' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "qualifiedName": "io.acryl.privacy.retentionTime",
   "valueType": "urn:li:dataType:datahub.number",
   "description": "Retention Time is used to figure out how long to retain records in a dataset",
   "displayName": "Retention Time",
   "cardinality": "MULTIPLE",
   "entityTypes": [
        "urn:li:entityType:datahub.dataset",
        "urn:li:entityType:datahub.dataFlow"
    ],
   "allowedValues": [
     {
       "value": {"double": 30},
       "description": "30 days, usually reserved for datasets that are ephemeral and contain pii"
     },
     {
       "value": {"double": 60},
       "description": "Use this for datasets that drive monthly reporting but contain pii"
     },
     {
       "value": {"double": 365},
       "description": "Use this for non-sensitive data that can be retained for longer"
     }
   ]
}' | jq
```

## 读取结构化属性

运行以下命令即可查看创建的属性：

```commandline
datahub properties get --urn {urn}
```

例如，你可以运行 `datahub properties get --urn urn:li:structuredProperty:io.acryl.privacy.retentionTime`。
如果成功，你应该会看到有关属性的元数据返回。

```commandline
{
  "urn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime",
  "qualified_name": "io.acryl.privacy.retentionTime",
  "type": "urn:li:dataType:datahub.number",
  "description": "Retention Time is used to figure out how long to retain records in a dataset",
  "display_name": "Retention Time",
  "entity_types": [
    "urn:li:entityType:datahub.dataset",
    "urn:li:entityType:datahub.dataFlow"
  ],
  "cardinality": "MULTIPLE",
  "allowed_values": [
    {
      "value": "30",
      "description": "30 days, usually reserved for datasets that are ephemeral and contain pii"
    },
    {
      "value": "90",
      "description": "Use this for datasets that drive monthly reporting but contain pii"
    },
    {
      "value": "365",
      "description": "Use this for non-sensitive data that can be retained for longer"
    }
  ]
}
```

请求示例：

```shell
curl -X 'GET' -v \
  'http://localhost:8080/openapi/v2/entity/structuredProperty/urn%3Ali%3AstructuredProperty%3Aio.acryl.privacy.retentionTime/propertyDefinition' \
  -H 'accept: application/json' | jq
```

回复示例：

```commandline
{
  "value": {
    "allowedValues": [
      {
        "value": {
          "double": 30.0
        },
        "description": "30 days, usually reserved for datasets that are ephemeral and contain pii"
      },
      {
        "value": {
          "double": 60.0
        },
        "description": "Use this for datasets that drive monthly reporting but contain pii"
      },
      {
        "value": {
          "double": 365.0
        },
        "description": "Use this for non-sensitive data that can be retained for longer"
      }
    ],
    "qualifiedName": "io.acryl.privacy.retentionTime",
    "displayName": "Retention Time",
    "valueType": "urn:li:dataType:datahub.number",
    "description": "Retention Time is used to figure out how long to retain records in a dataset",
    "entityTypes": [
      "urn:li:entityType:datahub.dataset",
      "urn:li:entityType:datahub.dataFlow"
    ],
    "cardinality": "MULTIPLE"
  }
}
```

## 将结构化属性设置为数据集

此操作将设置/替换实体上的所有结构化属性。请参阅添加/删除单个属性的 PATCH 操作。

通过创建包含结构化属性的数据集 yaml 文件，可以将结构化属性设置到数据集中。例如，下面是一个在字段和数据集级别都包含结构化属性的数据集 yaml 文件。

请参阅：

![此处的完整示例](../../../metadata-ingestion/examples/structured_properties/dataset.yaml)

使用 CLI 插入数据集 yaml 文件：

```commandline
datahub dataset upsert -f {dataset_yaml}
```

如果成功，你应该看到 `Update succeeded for urn:li:dataset:...`

以下命令将为数据集 `urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)` 设置结构化属性 `retentionTime` 为 `90`。
请注意，在执行此命令前，结构化属性和数据集必须存在。（你可以使用 “datahub docker ingest-sample-data” 创建样本数据集）

```commandline
curl -X 'POST' -v \
  'http://localhost:8080/openapi/v2/entity/dataset/urn%3Ali%3Adataset%3A%28urn%3Ali%3AdataPlatform%3Ahive%2CSampleHiveDataset%2CPROD%29/structuredProperties' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "properties": [
    {
      "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime",
      "values": [
        {"string": "90"}
      ]
    }
  ]
}' | jq
```

### 预期结果

数据集上传后，您可以在用户界面中查看数据集，并在 “Properties” 选项卡下查看与数据集相关的属性。

![sp-set](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/sp-set.png)

或者运行以下命令查看与数据集相关的属性：

```commandline
datahub dataset get --urn {urn}
```

## 修补结构化属性值

本节将向你展示如何修补结构化属性值-通过删除、添加或倒插单个属性。

### 添加结构化属性值

在本例中，我们将扩展创建第二个结构化属性，并将两个属性都应用到之前使用的同一个数据集。
之后，你的系统就会同时包含 `io.acryl.privacy.retentionTime` 和 `io.acryl.privacy.retentionTime02` 两个属性。

让我们开始创建第二个结构化属性。

```commandline
curl -X 'POST' -v \
  'http://localhost:8080/openapi/v2/entity/structuredProperty/urn%3Ali%3AstructuredProperty%3Aio.acryl.privacy.retentionTime02/propertyDefinition' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "qualifiedName": "io.acryl.privacy.retentionTime02",
    "displayName": "Retention Time 02",
    "valueType": "urn:li:dataType:datahub.string",
    "allowedValues": [
        {
            "value": {"string": "foo2"},
            "description": "test foo2 value"
        },
        {
            "value": {"string": "bar2"},
            "description": "test bar2 value"
        }
    ],
    "cardinality": "SINGLE",
    "entityTypes": [
        "urn:li:entityType:datahub.dataset"
    ]
}' | jq

```

此命令将把两个属性中的一个分别附加到我们的测试数据集 `urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)` 中。
具体来说，这将把 `io.acryl.privacy.retentionTime` 设置为 `90`，把 `io.acryl.privacy.retentionTime02` 设置为 `bar2`。

```commandline
curl -X 'POST' -v \
  'http://localhost:8080/openapi/v2/entity/dataset/urn%3Ali%3Adataset%3A%28urn%3Ali%3AdataPlatform%3Ahive%2CSampleHiveDataset%2CPROD%29/structuredProperties' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "properties": [
    {
      "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime",
      "values": [
        {"string": "90"}
      ]
    },
    {
      "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime02",
      "values": [
        {"string": "bar2"}
      ]
    }
  ]
}' | jq
```

#### 预期结果A

您可以看到，数据集现在有两个附加的结构化属性。

![sp-add](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/sp-add.png)

### 移除结构化属性值

测试数据集的预期状态包括 2 个结构化属性。
我们想移除第一个属性（`io.acryl.privacy.retentionTime`）并保留第二个属性。(`io.acryl.privacy.retentionTime02`)。

```commandline
curl -X 'PATCH' -v \
  'http://localhost:8080/openapi/v2/entity/dataset/urn%3Ali%3Adataset%3A%28urn%3Ali%3AdataPlatform%3Ahive%2CSampleHiveDataset%2CPROD%29/structuredProperties' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json-patch+json' \
  -d '{
        "patch": [
            {
                "op": "remove",
                "path": "/properties/urn:li:structuredProperty:io.acryl.privacy.retentionTime"
            }
        ],
        "arrayPrimaryKeys": {
            "properties": [
                "propertyUrn"
            ]
        }
      }' | jq
```

回复将显示预期属性已被删除。

```commandline
{
  "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
  "aspects": {
    "structuredProperties": {
      "value": {
        "properties": [
          {
            "values": [
              {
                "string": "bar2"
              }
            ],
            "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime02"
          }
        ]
      }
    }
  }
}
```

#### 预期结果B

可以看到，第一个属性已被删除，第二个属性仍然存在。

![sp-remove](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/sp-remove.png)

### 插入结构化属性值

在本例中，我们将以不同的值添加属性，同时保留现有属性。

```commandline
curl -X 'PATCH' -v \
  'http://localhost:8080/openapi/v2/entity/dataset/urn%3Ali%3Adataset%3A%28urn%3Ali%3AdataPlatform%3Ahive%2CSampleHiveDataset%2CPROD%29/structuredProperties' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json-patch+json' \
  -d '{
        "patch": [
            {
                "op": "add",
                "path": "/properties/urn:li:structuredProperty:io.acryl.privacy.retentionTime",
                "value": {
                    "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime",
                    "values": [
                        {
                            "string": "365"
                        }
                    ]
                }
            }
        ],
        "arrayPrimaryKeys": {
            "properties": [
                "propertyUrn"
            ]
        }
    }' | jq
```

以下是预期答复：

```commandline
{
  "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
  "aspects": {
    "structuredProperties": {
      "value": {
        "properties": [
          {
            "values": [
              {
                "string": "bar2"
              }
            ],
            "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime02"
          },
          {
            "values": [
              {
                "string": "365"
              }
            ],
            "propertyUrn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime"
          }
        ]
      }
    }
  }
}
```

回复显示，属性被重新添加了新值 bar，而不是之前的值 foo。

#### 预期结果C

可以看到，第一个属性已重新添加了新值，而第二个属性仍然存在。

![sp-upsert](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/sp-upsert.png)

## 删除结构化属性

DataHub 中有两种类型的删除：硬删除和软删除。从当前版本开始，结构化属性只支持软删除。

软删除

软删除的结构化属性不会删除结构化属性实体上的任何底层数据或写入其他实体的结构化属性值。软删除是 100% 可逆的，数据不会丢失。当结构化属性被软删除时，一些操作将不可用。

结构化属性软删除的影响：

- 具有软删除结构化属性值的实体不会返回软删除的属性
- 拒绝更新软删除结构属性的定义
- 拒绝向实体添加软删除的结构化属性值
- 使用软删除结构化属性的搜索过滤器将被拒绝

以下命令将软删除测试属性。

```commandline
datahub delete --urn {urn}
```

下面的命令将通过写入状态方面来软删除测试属性。

```commandline
curl -X 'POST' \
  'http://localhost:8080/openapi/v2/entity/structuredProperty/urn%3Ali%3AstructuredProperty%3Aio.acryl.privacy.retentionTime/status?systemMetadata=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
"removed": true
}' | jq
```

如果要**移除软删除**，可以通过硬删除状态方面或将移除布尔值更改为 “false”（如下所示）来实现。

```commandline
curl -X 'POST' \
  'http://localhost:8080/openapi/v2/entity/structuredProperty/urn%3Ali%3AstructuredProperty%3Aio.acryl.privacy.retentionTime/status?systemMetadata=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
"removed": false
}' | jq
```
