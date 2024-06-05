---
标题 “导言”
---

# 转换器

## 什么是转换器？

很多时候，我们想在元数据到达摄取汇之前对其进行修改--例如，我们可能想添加自定义标签、所有权、属性或修补某些字段。转换器可以让我们完成这些工作。

此外，转换器还允许我们对摄取的元数据进行精细控制，而无需自己修改摄取框架的代码。相反，你可以编写自己的模块，随心所欲地转换元数据事件。要在配方中加入转换器，只需提供转换器的名称以及转换器所需的任何配置即可。

> 注释
  为不存在的元数据提供urns将导致意外行为。请确保您的 DataHub 实例中已经存在要在转换器中应用的任何标记、术语、域等瓮。
  例如，在转换器中添加域urn 以应用于数据集，如果域实体不存在，则不会创建域实体。因此，您无法向其添加文档，它也不会显示在高级搜索中。这适用于您在转换器中应用的任何元数据。

## 提供的转换器

除了编写自己的转换器（见下文）外，我们还提供了一些简单的转换器，用于添加标签、术语表术语、属性和所有权信息。

DataHub 提供的数据集转换器有：

- [简单添加数据集所有权](./dataset_transformer.md#simple-add-dataset-ownership)
- [模式添加数据集所有权](./dataset_transformer.md#pattern-add-dataset-ownership)
- [简单移除数据集所有权](./dataset_transformer.md#simple-remove-dataset-ownership)
- [标记数据集状态](./dataset_transformer.md#mark-dataset-status)
- [简单添加数据集全局标签](./dataset_transformer.md#simple-add-dataset-globaltags)
- [模式添加数据集全局标签](./dataset_transformer.md#pattern-add-dataset-globaltags)
- [添加数据集全局标签](./dataset_transformer.md#add-dataset-globaltags)
- [设置数据集浏览路径](./dataset_transformer.md#set-dataset-browsepath)
- [简单添加数据集术语表](./dataset_transformer.md#simple-add-dataset-glossaryterms)
- [模式添加数据集术语表](./dataset_transformer.md#pattern-add-dataset-glossaryterms)
- [模式添加数据集模式字段 glossaryTerms](./dataset_transformer.md#pattern-add-dataset-schema-field-glossaryterms)
- [模式添加数据集模式字段 globalTags](./dataset_transformer.md#pattern-add-dataset-schema-field-globaltags)
- [简单添加数据集 datasetProperties](./dataset_transformer.md#simple-add-dataset-datasetproperties)
- [添加数据集属性](./dataset_transformer.md#add-dataset-datasetproperties)
- [简单添加数据集域](./dataset_transformer.md#simple-add-dataset-domains)
- [模式添加数据集域](./dataset_transformer.md#pattern-add-dataset-domains)
