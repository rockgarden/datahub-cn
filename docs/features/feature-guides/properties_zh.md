# 关于 DataHub 属性

DataHub 自定义属性和结构化属性是为资产收集有意义的元数据的强大工具，这些元数据可能无法完美地融入 DataHub 中的其他方面，如词汇表术语、标签等。这两种类型都可以在资产的 “Properties” 选项卡中找到：

![custom_and_structured_properties](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/properties/custom_and_structured_properties.png)

本指南将解释每种属性类型的区别和使用案例。

## 什么是自定义属性和结构化属性？

以下是这两种属性类型的区别一览：

| 自定义属性 | 结构化属性 |
| --- | --- |
| 以字符串形式存储的键值对映射 | 经过验证的命名空间和数据类型 |
| 在摄取过程中和通过 API 添加到资产中 | 通过 YAML 定义；通过 CLI 创建并添加到资产中 |
| 不支持基于 UI 的编辑 | 支持基于 UI 的编辑 |

**自定义属性**是键值对字符串，用于捕捉标准元数据字段中无法获取的资产附加信息。自定义属性可在摄取过程中自动添加到资产中，也可通过应用程序接口以编程方式添加到资产中，但*不能*通过用户界面进行编辑。

![custom_properties_highlight](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/properties/custom_properties_highlight.png)

**结构化属性**是自定义属性（Custom Properties）的扩展，提供了一种结构化的验证方式，可将元数据附加到 DataHub 资产。结构化属性从 v0.13.1 起可用，具有预定义类型（日期、整数、URN、字符串等）。它们可以配置为只接受一组特定的允许值，从而更容易确保高水平的数据质量和一致性。结构化属性通过 YAML 进行定义，通过 CLI 添加到资产中，并可通过用户界面进行编辑。

![structured_properties_highlight](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/properties/structured_properties_highlight.png)

## 自定义属性和结构化属性的用例

**自定义属性**有助于在摄取过程中或通过应用程序接口以编程方式从源系统中捕获原始元数据。一些例子包括：

- 生成数据集的代码的 GitHub 文件位置
- 数据编码类型
- 账户 ID、群集大小和数据集存储区域

**结构化属性**对于设置和执行元数据收集标准非常有用，尤其是在支持合规性和治理计划方面。可通过 API 以编程方式添加值，然后根据需要通过 DataHub UI 手动添加。一些示例包括：

- Deprecation Date（废弃日期）
  - Type: Date, Single Select
  - Validation: 格式必须为 'YYYY-MM-DD'
- Data Retention Period（数据保留期）
  - Type: String, Single Select
  - Validation: 遵守允许值 "30 Days", "90 Days", "365 Days", or "Indefinite"
- Consulted Compliance Officer（咨询合规官）, 从 DataHub 用户列表中选择
  - Type: DataHub User, Multi-Select
  - Validation: 必须是有效的 DataHub 用户 URN

通过使用 “结构化属性”，合规和管理官员可确保跨资产数据收集的一致性。

## 创建、分配和编辑结构化属性

结构化属性通过 YAML 定义，然后通过 DataHub CLI 创建并分配给 DataHub 资产。

下面是我们在 YAML 中定义上述示例的方法：

```yaml
- id: deprecation_date
  qualified_name: deprecation_date
  type: date # Supported types: date, string, number, urn, rich_text
  cardinality: SINGLE # Supported options: SINGLE, MULTIPLE
  display_name: Deprecation Date
  description: "Scheduled date when resource will be deprecated in the source system"
  entity_types: # Define which types of DataHub Assets the Property can be assigned to
    - dataset
- id: retention_period
  qualified_name: retention_period
  type: string # Supported types: date, string, number, urn, rich_text
  cardinality: SINGLE # Supported options: SINGLE, MULTIPLE
  display_name: Data Retention Period
  description: "Predetermined storage duration before being deleted or archived 
                based on legal, regulatory, or organizational requirements"
  entity_types: # Define which types of DataHub Assets the Property can be assigned to
    - dataset
  allowed_values:
    - value: "30 Days"
      description: "Use this for datasets that are ephemeral and contain PII"
    - value: "90 Days"
      description: "Use this for datasets that drive monthly reporting but contain PII"
    - value: "365 Days"
      description: "Use this for non-sensitive data that can be retained for longer"
    - value: "Indefinite"
      description: "Use this for non-sensitive data that can be retained indefinitely"
- id: compliance_officer
  qualified_name: compliance_officer
  type: urn # Supported types: date, string, number, urn, rich_text
  cardinality: MULTIPLE # Supported options: SINGLE, MULTIPLE
  display_name: Consulted Compliance Officer(s)
  description: "Member(s) of the Compliance Team consulted/informed during audit"
  type_qualifier: # Define the type of Asset URNs to allow
    - corpuser
    - corpGroup
  entity_types: # Define which types of DataHub Assets the Property can be assigned to
    - dataset
```

> 注意
  要了解通过 CLI 创建和分配结构化属性的更多信息，请参阅 [Create Structured Properties](/docs/api/tutorials/structured-properties_zh.md) 教程。

一旦将结构化属性分配给资产，具有 “Edit Properties” 元数据权限的用户就可以通过 DataHub UI 更改结构化属性值。

![edit_structured_properties_modal](https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/properties/edit_structured_properties_modal.png)

### API

请参阅以下与自定义和结构化属性相关的 API 指南：

- [自定义属性 API 指南](/docs/api/tutorials/custom-properties_zh.md)
- [结构化属性 API 指南](/docs/api/tutorials/structured-properties_zh.md)

## 常见问题和故障排除

**为什么我不能从 DataHub UI 编辑结构化属性的值？**

1. 您的 DataHub 版本不支持基于用户界面的结构化属性编辑。请确认您正在运行 DataHub v0.13.1 或更高版本。
2. 您正在尝试编辑自定义属性，而不是结构化属性。确认您正在尝试编辑结构化属性，该属性将显示 “Edit” 按钮。请注意，自定义属性不能进行基于用户界面的编辑，以减少重复摄取时的覆盖。
3. 您没有必要的权限。请向管理员确认您拥有 `Edit Properties` 元数据权限。

### 相关功能

- [文档表单](/docs/features/feature-guides/documentation-forms.md)
