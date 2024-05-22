# 数据合同

## 什么是数据合同

数据合约是数据资产生产者和消费者之间的**协议**，是对数据质量的承诺。
它通常包括有关数据模式、新鲜度和数据质量的[断言](assertions.md)。

数据合约的一些主要特征包括

- **可验证**：基于实际的物理数据资产，而非其元数据（例如，模式检查、列级数据检查和操作 SLA，但不包括文档、所有权和标签）。
- **一组断言**： 对物理资产进行实际检查，以确定合同的状态（模式、新鲜度、容量、自定义和列）
- **面向生产者**： 每个物理数据资产有一个合约，由生产者拥有。

面向消费者的数据合约

我们采用面向生产者的合同是为了保持合同数量的可控性，同时也是因为我们希望消费者能够在给定的物理资产合同中看到大量重叠。不过，我们也听到一些反馈意见，认为面向消费者的数据合同可以满足某些需求，而面向生产者的合同则无法满足这些需求。例如，在相同的物理数据资产上为每个消费者签订一份合同，将允许每个消费者仅在其关心的断言被违反时获得警报！

下面是 DataHub 中数据合约用户界面的截图。

<p align=“center”>
  <img width=“100%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/validated-data-contracts-ui.png”/>
</p>

## 数据合约和断言

数据合同的另一种表述方式是物理数据资产上可验证的断言包，代表公共生产者的承诺。
这些断言可以是资产上的所有断言，也可以是您希望向消费者公开承诺的子集。数据合约允许您**将所选的一组断言**作为公开承诺进行推广：如果未满足该断言子集，则数据合约失败。

有关断言类型以及如何创建和运行断言的更多详情，请参阅 [assertions文档](/docs/managed-datahub/observe/assertions.md)。

> 注意 所有权
物理数据资产的所有者也是合约的所有者，可以接受提议的更改，也可以自己更改合约。

## 如何创建数据合同

数据合约可通过 DataHub CLI (YAML)、API 或用户界面创建。

### 使用 YAML 的 DataHub CLI

对于通过 CLI 创建，这是一个简单的 CLI upsert 命令，您可以将其集成到您的 CI/CD 系统中，以发布您的数据合约及其任何更改。

1. 定义数据合约。

```yaml
{{ inline /metadata-ingestion/examples/library/create_data_contract.yml show_path_as_comment }}
```

2. 使用 CLI 运行以下命令创建合同。

```shell
datahub datacontract upsert -f contract_definition.yml
```

3. 现在你可以在用户界面上看到你的合同了。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/data-contracts-ui.png”/>
</p>

### 用户界面

1. 导航至您希望创建合同的数据集的数据集简介
2. 在 “**验证**”>“**数据合约**”选项卡下，单击 “**创建**”。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/create-data-contract-ui.png”/>
</p>

3. 选择您希望包含在数据合约中的断言。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/select-assertions.png”/> </p> 4.
</p>

> 注意 通过用户界面创建数据合约
通过用户界面创建数据合约时，必须首先创建新鲜度、模式和数据质量断言。

4. 现在您可以在用户界面中看到它。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/contracts-created.png”/>
</p>

### API

创建数据合约的 API 指南即将发布！

### 如何运行数据合约

运行数据合约取决于运行合约的断言并在 Datahub 上获取结果。使用 Acryl Observe（在 SAAS 上可用），您可以在 Datahub 上安排断言。否则，您可以在 Datahub 外部运行断言，并将结果发布回 Datahub。

如下所述，Datahub 与 DBT Test 和 Great Expectations 完美集成。对于其他第三方断言运行程序，您需要使用我们的 API 将断言结果发布回我们的平台。

### DBT 测试

在 DBT 输入过程中，我们会获取包含 dbt 测试运行结果的 dbt `run_results` 文件，并将其转换为断言运行。[参见此处的详细信息](/docs/generated/ingestion/sources/dbt.md#module-dbt)

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/dbt-test.png”/>
</p>

### 远大前程

对于Great Expectations，您可以将**DataHubValidationAction**直接集成到您的Great Expectations检查点中，以便将断言（又称期望）结果发送到Datahub。[请参阅此处的指南]（.../.../.../metadata-ingestion/integration_docs/great-expectations.md）。

<p align=“center”>
  <img width=“70%” src=“https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/gx-test.png”/>
</p>
