# 配方

配方是元数据摄取的主要配置文件。它告诉我们的摄取脚本从哪里获取数据（源）和把数据放到哪里（汇）。

![sources-sinks](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/sources-sinks.png)

## 配置配方

配方文件的基本形式包括

- source，其中包含数据源的配置。（请参阅 [源](source_overview.md)）。
- sink，定义元数据的目的地（参见 [Sinks](sink_overview.md)）。

下面是一个从 MSSQL（源）提取元数据并将其放入默认汇（datahub-rest）的简单方法。

```yaml
# The simplest recipe that pulls metadata from MSSQL and puts it into DataHub
# using the Rest API.
source:
  type: mssql
  config:
    username: sa
    password: ${MSSQL_PASSWORD}
    database: DemoData
# sink section omitted as we want to use the default datahub-rest sink
sink:
  type: "datahub-rest"
  config:
    server: "http://localhost:8080"
```

[examples/recipes](./examples/recipes)目录中包含了大量示例。有关每个源和汇的完整信息和上下文，请参阅[插件表](../docs/cli.md#installing-plugins)中描述的页面。

> 请注意，一个配方文件只能有一个源和一个汇。如果需要多个源，则需要多个配方文件。

## 运行配方

DataHub 支持通过 CLI 或 UI 运行配方。

安装 CLI 和摄取插件。

```shell
python3 -m pip install --upgrade acryl-datahub
pip install 'acryl-datahub[datahub-rest]'
```

操作这个配方非常简单：

```shell
datahub ingest -c recipe.dhub.yaml
```

有关通过 CLI 运行配方的详细指南，请参阅 [CLI摄取指南](cli-ingestion.md)。

您可以在 DataHub 的**消化**选项卡中配置和运行配方。

![ingestion-tab](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/ingestion-tab.png)

- 确保您拥有**管理元数据输入和管理机密**权限。
- 导航至 DataHub 中的**摄取**选项卡。
- 通过用户界面创建摄取源并配置配方。
- 点击**执行**。

有关通过用户界面运行配方的详细指南，请参阅[用户界面摄取指南](../docs/ui-ingestion_zh.md)。

### 高级配置

### 处理配方中的敏感信息

我们会自动扩展配置中的环境变量（例如 `${MSSQL_PASSWORD}`），类似于 GNU bash 或 docker-compose 文件中的变量替换。
详情请参阅[variable-substitution](https://docs.docker.com/compose/compose-file/compose-file-v2/#variable-substitution)。
这种环境变量替换应该用于掩盖配方文件中的敏感信息。只要能在摄取过程中安全地获取环境变量，就没有必要在配方中存储敏感信息。

### 转换

如果您想在数据到达摄取汇之前对其进行修改，例如添加额外的所有者或标签，您可以使用转换器编写自己的模块并将其与 DataHub 集成。转换器需要扩展配方，添加新的部分来描述要运行的转换器。

例如，从 MSSQL 采集元数据并将默认 "Important" 标签应用到所有数据集的管道描述如下：

```yaml
# A recipe to ingest metadata from MSSQL and apply default tags to all tables
source:
  type: mssql
  config:
    username: sa
    password: ${MSSQL_PASSWORD}
    database: DemoData

transformers: # an array of transformers applied sequentially
  - type: simple_add_dataset_tags
    config:
      tag_urns:
        - "urn:li:tag:Important"
# default sink, no config needed
```

查看 [transformers guide](./docs/transformer/intro_zh.md) 了解更多有关如何使用转换器创建真正灵活的管道来处理元数据的信息！

### 自动完成和语法验证

用 **.dhub.yaml** 扩展名命名配方，如`myrecipe.dhub.yaml_`，以使用 vscode 或 intellij 作为具有自动完成和语法验证功能的配方编辑器。

确保为您的编辑器安装了 yaml 插件：

- 对于 vscode，请安装 [Redhat 的 yaml 插件](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
- 对于 intellij 安装 [官方 yaml 插件](https://plugins.jetbrains.com/plugin/13126-yaml)
