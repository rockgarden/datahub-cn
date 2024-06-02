# 商业词汇

该插件可从 yaml 格式文件中提取业务词汇表元数据。

## 基于 CLI 的输入

安装插件

`pip install 'acryl-datahub[datahub-business-glossary]'`

### 入门秘诀

查看以下配方，开始摄取！请参阅下面的完整配置选项。

有关编写和运行配方的一般说明，请参阅我们的[主要配方指南](https://datahubproject.io/docs/metadata-ingestion#recipes)。

```yaml
source:
  type: datahub-business-glossary
  config:
    # Coordinates
    file: /path/to/business_glossary_yaml
    enable_auto_id: true # recommended to set to true so datahub will auto-generate guids from your term names

# sink configs if needed
```

## 配置详情

1. 选项 Option

    > 请注意，YAML 配方中的嵌套字段用.来表示。

    |字段|描述|
    |-|-|
    |File ✅：One of string, string(path)|要摄取的业务词汇表文件的文件路径或 URL。|
    |**enable_auto_id**：boolean|根据节点/术语的层次结构生成引导符瓮，而不是纯文本路径瓮。默认值：假|

2. 模式 Schema

    该配置的 [JSONSchema](https://json-schema.org/) 内联如下。

    ```yaml
    {
    "title": "BusinessGlossarySourceConfig",
    "type": "object",
    "properties": {
        "file": {
        "title": "File",
        "description": "File path or URL to business glossary file to ingest.",
        "anyOf": [
            {
            "type": "string"
            },
            {
            "type": "string",
            "format": "path"
            }
        ]
        },
        "enable_auto_id": {
        "title": "Enable Auto Id",
        "description": "Generate guid urns instead of a plaintext path urn with the node/term's hierarchy.",
        "default": false,
        "type": "boolean"
        }
    },
    "required": [
        "file"
    ],
    "additionalProperties": false
    }
    ```

## 业务词汇表文件格式

业务词汇表(Business Glossary)源文件应为 .yml 文件，其顶层键如下：

1. 词汇表(Glossary)：业务词汇表文件的顶层关键字

    词汇表示例：

    ```yml
    version: 1                                              # the version of business glossary file config the config conforms to. Currently the only version released is `1`.
    source: DataHub                                         # the source format of the terms. Currently only supports `DataHub`
    owners:                                                 # owners contains two nested fields
      users:                                                # (optional) a list of user IDs
        - njones
      groups:                                               # (optional) a list of group IDs
        - logistics
    url: "https://github.com/datahub-project/datahub/"      # (optional) external url pointing to where the glossary is defined externally, if applicable
    nodes:                                                  # list of child **GlossaryNode** objects. See **GlossaryNode** section below
        ...
    ```

2. GlossaryNode: GlossaryNode 和 GlossaryTerm 对象的容器

    示例 GlossaryNode：

    ```yml
    - name: Shipping                                                # name of the node
      description: Provides terms related to the shipping domain    # description of the node
      owners:                                                       # (optional) owners contains 2 nested fields
        users:                                                      # (optional) a list of user IDs
          - njones
        groups:                                                     # (optional) a  list of group IDs
          - logistics
      nodes:                                                        # list of child **GlossaryNode** objects
        ...
      knowledge_links:                                              # (optional) list of **KnowledgeCard** objects
        - label: Wiki link for shipping
          url: "https://en.wikipedia.org/wiki/Freight_transport"
    ```

3. 术语表术语(GlossaryTerm)：业务术语表中的术语

    GlossaryTerm 示例：

    ```yml
    - name: FullAddress                                                          # name of the term
      description: A collection of information to give the location of a building or plot of land.    # description of the term
      owners:                                                                   # (optional) owners contains 2 nested fields
        users:                                                                  # (optional) a list of user IDs
          - njones
        groups:                                                                 # (optional) a  list of group IDs
          - logistics
      term_source: "EXTERNAL"                                                   # one of `EXTERNAL` or `INTERNAL`. Whether the term is coming from an external glossary or one defined in your organization.
      source_ref: FIBO                                                          # (optional) if external, what is the name of the source the glossary term is coming from?
      source_url: "https://www.google.com"                                      # (optional) if external, what is the url of the source definition?
      inherits:                                                                 # (optional) list of **GlossaryTerm** that this term inherits from
        -  Privacy.PII
      contains:                                                                 # (optional) a list of **GlossaryTerm** that this term contains
        - Shipping.ZipCode
        - Shipping.CountryCode
        - Shipping.StreetAddress
      custom_properties:                                                        # (optional) a map of key/value pairs of arbitrary custom properties
        - is_used_for_compliance_tracking: true
      knowledge_links:                                                          # (optional) a list of **KnowledgeCard** related to this term. These appear as links on the glossary node's page
        - url: "https://en.wikipedia.org/wiki/Address"
          label: Wiki link
      domain: "urn:li:domain:Logistics"                                            # (optional) domain name or domain urn
    ```

    要了解所有这些如何协同工作，请查看下面这个全面的商业词汇表示例文件：

    源文件链接[在此](../../metadata-ingestion/examples/bootstrap_data/business_glossary.yml)。

## 为术语生成自定义 ID

ID 通常是从词汇表术语/节点名称中推断出来的，请参见启用_auto_id 配置。但是，如果需要一个稳定的标识符，可以为术语生成一个自定义 ID。它在整个词汇表中应该是唯一的。

下面是一个 ID 示例： `id: "urn:li:glossaryTerm:41516e310acbfd9076fffc2c98d2d1a3"`

> 注意：一旦选择了自定义 ID，就不能轻易更改。

### 兼容性

与第一版商业词汇表格式兼容。随着我们发布该格式的更新版本，源代码也将随之更新。

#### 代码坐标

- 类名：datahub.ingestion.source.metadata.business_glossary.BusinessGlossaryFileSource
- 在 [Project](../../metadata-ingestion/src/datahub/ingestion/source/metadata/business_glossary.py) 上浏览
