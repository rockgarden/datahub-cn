# 元数据服务认证

## 简介

本文档为评估或操作 DataHub 的开发人员提供 DataHub 后端身份验证工作原理的技术概述。
它包括对该功能的动机、设计中的关键组件、提供的新功能和配置说明的描述。

## 背景

让我们回顾一下 DataHub 架构的两个关键组件：

- **DataHub Frontend Proxy** (datahub-frontend) - 将请求路由到下游元数据服务的资源服务器
- **DataHub Metadata Service** (datahub-gms) - 用于存储和服务 DataHub 元数据图的真实来源。

以前，身份验证完全由前台代理处理。当用户导航到 <http://localhost:9002/> 时，该服务将执行以下步骤：

- a. 检查是否存在特殊的 `PLAY_SESSION` cookie。
- b. 如果 cookie 存在且有效，则重定向到主页
- c. 如果 cookie 无效，则重定向到 `a.` DataHub 登录屏幕（用于[JAAS 身份验证](guides/jaas.md) 或 `b.` [配置的 OIDC 身份提供程序](guides/sso/configure-oidc-react_zh.md)以执行身份验证。

一旦前端代理层的身份验证成功，将在用户浏览器中设置一个无状态（基于令牌）会话 cookie（PLAY_SESSION）。
所有后续请求，包括 React UI 发出的 GraphQL 请求，都将使用此会话 cookie 进行身份验证。一旦请求超出前端服务层，它就被认为已经通过了身份验证。因此，元数据服务内部**没有本机身份验证**。

### 这种方法的问题

这种情况的主要挑战在于，对后端元数据服务的请求完全未经身份验证。需要在元数据服务层进行身份验证的用户有两种选择：

1. 在元数据服务前设置一个代理来执行身份验证
2. 通过 DataHub 前端代理路由到元数据服务的请求，在每个请求中包含 PLAY_SESSION Cookie。

这两种方法都不理想。设置代理进行身份验证需要时间和专业知识。从浏览器中提取并设置会话 Cookie 用于编程既笨拙又不可扩展。
笨拙且不可扩展。此外，扩展身份验证系统也很困难，需要在 DataHub Frontend 中实施一个新的 [Play模块](https://www.playframework.com/documentation/2.8.8/api/java/play/mvc/Security.Authenticator.html)。

## 在 DataHub 元数据服务中引入身份验证

为了解决这些问题，我们在**元数据服务**本身引入了可配置的身份验证，这意味着请求在通过元数据服务验证之前不再被视为可信请求。

为什么要将身份验证向下推？除了上述问题之外，我们还想为未来做一个规划基于 Kafka 的写入的身份验证可以以与 Rest 写入相同的方式执行。

## 配置元数据服务身份验证

元数据服务身份验证目前是**opt-in**。这意味着您可以在没有元数据服务身份验证的情况下继续使用 DataHub，而不会中断。

要启用元数据服务身份验证：

- 将 `datahub-gms` 和 `datahub-frontend` 容器/pod 的 `METADATA_SERVICE_AUTH_ENABLED` 环境变量设置为 “true”。
  
或

- 更改元数据服务 `application.yaml` 配置文件，将 `authentication.enabled` 设为 `true`，并
- 更改前端代理服务的配置文件`application.config`，将`metadataService.auth.enabled`设置为 `true`

设置配置标志后，只需重启元数据服务即可开始执行身份验证。

一旦启用，对元数据服务的所有请求都需要经过身份验证；如果使用 DataHub 随附的默认身份验证器，这意味着所有请求都需要在授权头中提交访问令牌，如下所示：

```txt
Authorization: Bearer <access-token> 
```

对于登录用户界面的用户，这一过程将由我们代为处理。登录时，浏览器会设置一个 cookie，该 cookie 内部包含元数据服务的有效访问令牌。浏览用户界面时，将提取该令牌并发送给元数据服务，以验证每次请求。

对于要以编程方式访问元数据服务的用户，即运行摄取的用户，目前的建议是生成**个人访问令牌(Personal Access Token)**（如上所述），并在配置[Ingestion Recipes](.../.../metadata-ingestion/README.md#recipes)时使用该令牌。
要配置在摄取中使用的令牌，只需为 `datahub-rest` 汇填充 “token” 配置：

```yml
source:
  # source configs
sink:
  type: "datahub-rest"
  config:
    ...
    token: <your-personal-access-token-here!> 
```

> 请注意，通过 `datahub-kafka` sink 进行的摄取*目前*仍将是未经身份验证的。很快，我们将引入支持在事件有效载荷中提供访问令牌，以验证通过 Kafka 提出的摄取请求。

### 未来 DataHub 前端代理的作用

有了这些变化，DataHub 前端代理将继续在复杂的身份验证过程中发挥重要作用。它将作为基于用户界面的会话身份验证的源头，并将继续支持第三方 SSO 配置 (OIDC)和 JAAS 配置。

主要改进是前端服务将验证用户界面登录时提供的凭据并生成 DataHub **访问令牌**，将其嵌入传统的会话 cookie（将继续有效）。

总之，DataHub 前端服务将继续在身份验证中发挥重要作用。不过，它的作用范围仍将局限于 React UI 特有的问题。

## 何去何从

这些变更是元数据服务身份验证的第一个里程碑。它们将作为我们根据社区需求优先构建新功能的基础：

1. **动态身份验证插件**： 配置和注册自定义身份验证器实现，无需分叉 DataHub。
2. **服务账户**： 创建服务账户并代表它们生成访问令牌。
3. **Kafka 摄取验证**： 对来自元数据服务内 Kafka 摄取汇的摄取请求进行身份验证。
4. **访问令牌管理**： 能够查看、管理和撤销已生成的访问令牌。（目前，访问令牌不包含服务器端状态，因此一旦授予就无法撤销）。

### 问与答

### 如果我不想使用元数据服务身份验证怎么办？

现在完全没问题。元数据服务身份验证默认是禁用的，只有当你提供了环境变量 `METADATA_SERVICE_AUTH_ENABLED` 至 `datahub-gms` 容器，或将 `authentication.enabled` 更改为 “true”。
或将 DataHub 元数据服务配置 (`application.yaml`)中的 `authentication.enabled` 更改为 “true”。

尽管如此，我们还是建议您在生产用例中启用身份验证，以防止任意行为者将元数据摄取到 DataHub。

### 如果启用元数据服务身份验证，摄取会停止工作吗？

如果启用元数据服务身份验证，在使用 datahub 时，您需要为 “令牌” 配置值提供一个值。
在 [ingestion recipes](https://datahubproject.io/docs/metadata-ingestion/#recipes) 中使用 `datahub-rest` 汇时，您需要为 “令牌” 配置值提供一个值。请参阅
有关配置的详细信息，请参阅[Rest Sink Docs](https://datahubproject.io/docs/metadata-ingestion/sink_docs/datahub#config-details)。

我们建议在配置您的摄取源时，从可信的 DataHub 帐户（如根用户 “datahub”）生成个人访问令牌（如上所述）。

请注意，您也可以在 `datahub-rest` 水槽(sink)中提供 `extraHeaders` 配置，以指定与每个请求一起传递的自定义标头。与每个请求一起传递。例如，这可以与使用自定义身份验证器进行身份验证结合使用。

### 如何为服务账户生成访问令牌？

DataHub 上还没有 “service account” 或 “bot” 的正式概念。目前，我们建议您将 DataHub 的任何编程客户端配置为使用从具有正确权限的用户（例如根 “datahub” 用户帐户）生成的个人访问令牌。

#### 我想使用自定义验证器验证请求？如何操作？

您可以通过更改元数据服务的 `application.yaml` 配置文件，配置 DataHub 以将您的自定义**验证器**添加到**验证链**：

```yml
authentication:
  enabled: true # Enable Metadata Service Authentication 
  ....
  authenticators: # Configure an Authenticator Chain 
    - type: <fully-qualified-authenticator-class-name> # E.g. com.linkedin.datahub.authentication.CustomAuthenticator
      configs: # Specific configs that should be passed into 'init' method of Authenticator
        customConfig1: <value> 
```

请注意，您需要在类路径上创建一个实现了 `Authenticator` 接口的类，并提供一个零参数构造函数。
的类路径上提供零参数构造函数。

我们热爱贡献！如果 Authenticator 非常有用，请随时提交 PR，贡献一个 Authenticator。

### 既然我可以向 DataHub 代理服务和 DataHub 元数据服务发出验证请求，我应该使用哪个？

以前，我们建议用户在进行以下操作时直接联系元数据服务

- 通过配方摄取元数据
- 向 Rest.li API 发出编程请求
- 向 GraphQL API 发出编程请求

有了这些变更，我们将转而建议用户将所有流量（无论是否为程序化流量）都导向到 **DataHub 前端代理**，因为目前可通过 `/api/gms`路径路由到元数据服务端点。
此建议旨在尽量减少 DataHub 的暴露面积，使平台的安全、操作、维护和开发更简单。

在实践中，这将需要迁移元数据 [ingestion recipes]（.../.../metadata-ingestion/README.md#recipes）使用的 `datahub-rest` 汇，使其指向稍有不同的主机 + 路径。

通过 DataHub 前端代理的示例配方：

```yml
source:
  # source configs
sink:
  type: "datahub-rest"
  config:
    ...
    token: <your-personal-access-token-here!> 
```
