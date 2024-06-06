# 自定义属性

## 为什么要在数据集上使用自定义属性？

数据集的自定义属性有助于提供标准元数据字段中无法提供的数据附加信息。自定义属性可用于描述数据的特定属性，如使用的度量单位、涵盖的日期范围或数据涉及的地理区域。这在处理大型复杂数据集时特别有用，因为额外的上下文有助于确保正确有效地使用数据。

DataHub 将数据集的自定义属性建模为字符串的键值对映射。

自定义属性还可用于启用高级搜索和发现功能，允许用户根据特定属性对数据集进行过滤和排序。这可以帮助用户快速查找和访问所需的数据，而无需手动查看大量数据集。

### 本指南的目标

本指南将向您展示如何在数据集 `fct_users_deleted` 上添加、删除或替换自定义属性。以下是每个操作的含义：

- 添加：在不影响现有属性的情况下向数据集添加自定义属性
- 删除：从数据集中移除特定属性，但不影响其他属性
- 替换 例如，“DatasetProperties” 方面包含 “customProperties” 以及其他字段，如 “name” 和 “description”。

## 先决条件

对于本教程，您需要部署 DataHub Quickstart 并摄取示例数据。
详细信息请参阅 [Datahub Quickstart Guide](/docs/quickstart.md)。

注意
在添加自定义属性之前，您需要确保目标数据集已存在于您的 DataHub 实例中。
如果尝试操作不存在的实体，操作将失败。
在本指南中，我们将使用样本摄取的数据。
:::

在本示例中，我们将向数据集 `fct_users_deleted` 添加一些自定义属性 `cluster_name` 和 `retention_time`。

摄取样本数据后，数据集 `fct_users_deleted` 应具有自定义属性部分，其中的 `encoding` 设置为 `utf-8`。

![dataset-properties-before](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/dataset-properties-before.png)

```shell
datahub get --urn "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_deleted,PROD)" --aspect datasetProperties
{
  "datasetProperties": {
    "customProperties": {
      "encoding": "utf-8"
    },
    "description": "table containing all the users deleted on a single day",
    "tags": []
  }
}
```

## 以编程方式添加自定义属性

以下代码将自定义属性 `cluster_name` 和 `retention_time` 添加到名为 `fct_users_deleted` 的数据集中，而不会影响现有属性。

> 🚫 目前不支持通过 GraphQL 在数据集上添加自定义属性。
> 请查看 [API功能对照表](/docs/api/datahub-apis.md#datahub-api-comparison) 了解更多信息

```java
{{ inline /metadata-integration/java/examples/src/main/java/io/datahubproject/examples/DatasetCustomPropertiesAdd.java show_path_as_comment }}
```

```python
{{ inline /metadata-ingestion/examples/library/dataset_add_properties.py show_path_as_comment }}
```

### 添加自定义属性的预期结果

现在可以看到两个新属性被添加到 `fct_users_deleted` 中，而之前的属性 `encoding` 保持不变。

![dataset-properties-added](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/dataset-properties-added.png)

我们还可以在使用 `datahub` cli 运行此代码后，通过编程检查 `datasetProperties` 方面来验证此操作。

```shell
datahub get --urn "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_deleted,PROD)" --aspect datasetProperties
{
  "datasetProperties": {
    "customProperties": {
      "encoding": "utf-8",
      "cluster_name": "datahubproject.acryl.io",
      "retention_time": "2 years"
    },
    "description": "table containing all the users deleted on a single day",
    "tags": []
  }
}
```

## 以编程方式添加和删除自定义属性

以下代码展示了如何在同一调用中添加和删除自定义属性。在下面的代码中，我们将从名为 `fct_users_deleted` 的数据集中添加自定义属性 `cluster_name` 并移除属性 `retention_time` ，而不会影响现有属性。

> 目前不支持通过 GraphQL 在数据集上添加和删除自定义属性。
> 请查看 [API功能对照表](/docs/api/datahub-apis.md#datahub-api-comparison) 了解更多信息

```java
{{ inline /metadata-integration/java/examples/src/main/java/io/datahubproject/examples/DatasetCustomPropertiesAddRemove.java show_path_as_comment }}
```

```python
{{ inline /metadata-ingestion/examples/library/dataset_add_remove_properties.py show_path_as_comment }}
```

### 对自定义属性进行添加和删除操作的预期结果

现在可以看到 `cluster_name` 属性已添加到 `fct_users_deleted`，而 `retention_time` 属性已删除。

![dataset-properties-added-removed](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/dataset-properties-added-removed.png)

We can also verify this operation programmatically by checking the `datasetProperties` aspect using the `datahub` cli.

```shell
datahub get --urn "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_deleted,PROD)" --aspect datasetProperties
{
  "datasetProperties": {
    "customProperties": {
      "encoding": "utf-8",
      "cluster_name": "datahubproject.acryl.io"
    },
    "description": "table containing all the users deleted on a single day",
    "tags": []
  }
}
```

## 以编程方式替换自定义属性

下面的代码会用一个新的属性映射替换当前的自定义属性，该映射只包含属性 `cluster_name` 和 `retention_time`。运行此代码后，先前的 `encoding` 属性将被删除。

> 🚫 目前不支持通过 GraphQL 在数据集上替换自定义属性。
> 请查看 [API 功能对照表](/docs/api/datahub-apis.md#datahub-api-comparison) 了解更多信息

```java
{{ inline /metadata-integration/java/examples/src/main/java/io/datahubproject/examples/DatasetCustomPropertiesReplace.java show_path_as_comment }}
```

```python
{{ inline /metadata-ingestion/examples/library/dataset_replace_properties.py show_path_as_comment }}
```

### 替换自定义属性的预期结果

现在可以看到 `cluster_name` 和 `retention_time` 属性已添加到 `fct_users_deleted` 中，但之前的 `encoding` 属性已不复存在。

![dataset-properties-replaced](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/apis/tutorials/dataset-properties-replaced.png)

我们还可以通过使用 `datahub` cli 检查 `datasetProperties` 方面，以编程方式验证这一操作。

```shell
datahub get --urn "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_deleted,PROD)" --aspect datasetProperties
{
  "datasetProperties": {
    "customProperties": {
      "cluster_name": "datahubproject.acryl.io",
      "retention_time": "2 years"
    },
    "description": "table containing all the users deleted on a single day",
    "tags": []
  }
}
```
