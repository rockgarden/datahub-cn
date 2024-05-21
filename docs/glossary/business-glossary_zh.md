---
标题： 商业词汇
---

import FeatureAvailability from '@site/src/components/FeatureAvailability';

# 业务词汇表

<FeatureAvailability/>

## 简介

在复杂的数据生态系统中工作时，使用共享词汇来组织数据资产非常有用。DataHub 中的业务词汇表功能可帮助您做到这一点，它提供了一个框架，用于定义一组标准化的数据概念，然后将它们与数据生态系统中存在的物理资产关联起来。

在本文档中，我们将介绍构成 DataHub 业务术语表功能的核心概念，并向您展示如何在您的组织中使用该功能。

### 术语和术语组

业务词汇表由两个重要基元组成： 术语和术语组(Terms & Term Groups)。

- **术语**：具有特定业务定义的单词或短语。
- **术语组**：就像文件夹一样，包含术语甚至其他术语组，以实现嵌套结构。

术语和术语组都允许您添加文档和唯一所有者。

对于词汇表术语，您还可以在 **Related Terms** 选项卡中建立不同术语之间的关系。您可以在这里创建包含和继承关系。最后，你可以在  **Related Entities** 选项卡中查看已标记术语的所有实体。

## 进入词汇表

要查看业务词汇表，用户必须拥有名为 Manage Glossaries 的平台权限，该权限可通过创建新的平台[策略](../authorization/policies.md)授予。

获得该权限后，您可以点击页面顶部名为 **Govern**的下拉菜单，然后点击 **Glossary**来访问您的词汇表：

<p align="center">
  <img width="100%"  src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/glossary-button.png"/>
</p>

现在您已进入术语表的根目录，应该可以看到所有术语和术语组，但没有为其分配父级。您还应该注意到左侧有一个层次导航器，可以轻松查看词汇表的结构！

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/root-glossary.png"/>
</p>

## 创建术语或术语组

通过用户界面创建术语和术语组有两种方法。首先，您可以直接从词汇表主页创建，方法是单击右上角的菜单圆点并选择所需的选项：

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/root-glossary-create.png"/>
</p>

您还可以直接从术语组页面创建术语或术语组。为此，您需要点击右上角的菜单圆点，然后选择您想要的内容：

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/create-from-node.png"/>
</p>

请注意，弹出的模式会自动将您所在的当前术语组设置为**Parent**。您可以通过选择输入并浏览词汇表以找到所需的术语组来轻松更改。此外，你还可以开始键入一个术语组的名称，通过搜索看到它的出现。您也可以将此输入留空，以便创建一个没有父级的术语或术语组。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/create-modal.png"/>
</p>

## 编辑术语或术语组

要编辑一个术语或术语组，首先需要进入要编辑的术语或术语组的页面。然后，只需单击名称旁边的编辑图标，即可打开一个内联编辑器。更改文本后，点击外部或回车键即可保存。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/edit-term.png"/>
</p>

## 移动术语或术语组

创建术语或术语组后，您可以随时将其移动到不同术语组的父级下。为此，请单击任一实体右上方的菜单圆点，然后选择 **Move**。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/move-term-button.png"/>
</p>

这将打开一个模态(modal)，您可以在其中浏览词汇表，找到所需的术语组。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/move-term-modal.png"/>
</p>

## 删除术语或术语组

要删除术语或术语组，需要进入要删除内容的实体页面，然后点击右上角的菜单圆点。在这里，你可以选择**Delete**，然后通过一个单独的模态进行确认。

> **注意**：目前我们只支持删除没有任何子项的术语组。在支持级联删除之前，您必须先删除所有子项，然后再删除术语组。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/delete-button.png"/>
</p>

## 向实体添加术语

一旦定义了词汇表，就可以开始将术语附加到数据资产。要将词汇表术语添加到资产，请转到资产的实体页面，找到右侧边栏的**Add Terms**按钮。

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/add-term-to-entity.png"/>
</p>

在弹出的模态(modal)中，您可以通过以下两种方式之一选择您关心的术语：

- 在输入框中按名称搜索术语
- 通过点击输入后出现的术语表下拉菜单进行导航

<p align=“center”>
  <img width=“100%” src="https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/glossary/add-term-modal.png"/>
</p>

## 特权

术语表术语和术语组与其他实体一样遵守元数据政策。不过，有两种特殊权限可用于在业务词汇表中配置权限。

- **管理直接词汇表子词汇**： 如果用户在词汇表术语组上拥有此权限，则可以直接在拥有此权限的术语组下创建、编辑和删除术语和术语组。
- **管理所有词汇表子词汇**： 如果用户在术语组上拥有此权限，则可以创建、编辑和删除该术语组下的任何术语或术语组。这也适用于子术语组的子术语组（以此类推）。

## 用 Git 管理术语表

在许多情况下，最好在版本控制系统（如 git）中管理业务词汇表。这样可以
这样可以通过变更管理和审核流程，更轻松地管理团队间的变更。

要使用 Git 管理词汇表，您可以在文件中定义词汇表，然后使用 DataHub CLI 将其摄取到 DataHub 中。
将其摄入 DataHub（例如，在 `git commit` 钩子上）。有关
词汇表文件格式以及如何将其摄取到 DataHub 的详细信息，请查看 [Business Glossary](https://datahubproject.io/docs/generated/ingestion/sources/business-glossary) 源指南。

## 关于词汇术语关系

DataHub 支持单个词汇表术语之间的 2 种不同关系： **Inherits From** 和 **Contains** 。

当一个术语是另一个术语的上集(superset)或包含(consists)另一个术语时，**Contains** 可用来关联两个术语表术语。

例如：**Address**术语_包含_**邮编**术语、**街道**术语和**城市**术语（_Has-A_样式关系）

当一个术语是另一个术语的_子类型_或_子类别_时，**Inherits**可用于关联两个术语表术语。
例如 **Email** 术语 _Inherits From_ **PII** 术语（_Is-A_ 类型关系）

这些关系类型可让您映射组织内现有的概念，使您能够在幕后更改概念之间的映射，而无需更改附加到单个数据资产和数据资产上的词汇表术语。

附加到单个数据资产和列上。

例如，您可以定义一个非常具体的词汇表术语，如 “电子邮件地址” 来表示物理数据类型，然后将其与 “电子邮件地址” 关联起来。
数据类型，然后通过 “继承(Inheritance)” 关系将其与更高级别的 “PII” 术语关联起来。
这样，您就可以轻松地维护包含或处理 `PII` 的所有数据资产集，同时还可以轻松地从 `PII` 术语库中添加和删除新术语。
例如，无需重新标注单个数据资产或列。

### 演示

请访问 [我们的演示网站](https://demo.datahubproject.io/glossary) 查看词汇表示例及其工作原理！

### 图形QL

- [ ] [addTerms](../../graphql/mutations.md#addterm)
- [ ] [addTerms](../../graphql/mutations.md#addterms)
- [ ] [batchAddTerms](../../graphql/mutations.md#batchaddterms)
- [ ] [removeTerm](../../graphql/mutations.md#removeterm)
- [ ] [batchRemoveTerms](../../graphql/mutations.md#batchremoveterms)
- [ ] [createGlossaryTerm](../../graphql/mutations.md#createglossaryterm)
- [ ] [createGlossaryNode](../../graphql/mutations.md#createglossarynode) (术语组)

使用 **glossaryTerms** 属性，您可以轻松获取具有给定 URN 的实体的术语表术语。请查看 [Working with Metadata Entities](../api/graphql/how-to-set-up-graphql_zh.md#querying-for-glossary-terms-of-an-asset)以了解示例。

### 资源

- [创建业务词汇表并在 DataHub 中使用](<https://blog.datahubproject.io/crea>)
