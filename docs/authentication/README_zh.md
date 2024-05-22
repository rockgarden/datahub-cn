# 概述

身份验证是验证用户或服务身份的过程。在 DataHub 内部有两个
处进行身份验证：

1. 用户尝试登录 DataHub 应用程序时的 DataHub 前端服务。
2. 向 DataHub 发送 API 请求时的 DataHub 后端服务。

在本文档中，我们将仔细研究这两个方面。

## 前端的身份验证

DataHub 普通用户的身份验证分为两个阶段。

登录时，由 DataHub 自身（通过用户名/密码输入）或第三方身份提供商进行身份验证。一旦用户身份验证后，将为用户生成一个永久会话令牌，并存储在浏览器侧的会话 cookie 中。
存储在浏览器会话 cookie 中。

DataHub 在登录时提供三种身份验证机制：

- **本机身份验证**使用 DataHub 本机存储和管理的用户名和密码组合，用户通过邀请链接进行邀请。
- [单点登录与OpenID Connect](guides/sso/configure-oidc-react_zh.md)，将身份验证责任委托给第三方系统，如 Okta 或 Google/Azure Authentication。这是生产系统的推荐方法。
- [JaaS身份验证](guides/jaas.md)适用于简单部署，其中通过身份验证的用户是某个已知列表的一部分，或作为[本地 DataHub 用户](guides/add-users.md)被邀请。

在后续请求中，会话令牌用于代表用户的验证身份，并由 DataHub 的后端服务验证（如下所述）。
最终，会话令牌会过期（默认为 24 小时），此时终端用户需要重新登录。

### 后端（元数据服务）中的身份验证

当用户在 DataHub 中请求数据时，DataHub 的后台（元数据服务）将通过 JSON Web 令牌对请求进行验证。这适用于来自 DataHub 应用程序的请求、
和对 DataHub API 的编程调用。有两类令牌非常重要：

1. **会话令牌**： 为 DataHub Web 应用程序用户生成。默认情况下，持续时间为 24 小时。
这些令牌被编码并存储在浏览器会话 cookie 中。会话令牌的有效期可通过 datahub-front 上的 `MAX_SESSION_TOKEN_AGE` 环境变量进行配置。
来配置。此外，`AUTH_SESSION_TTL_HOURS` 还能配置用户浏览器上角色 cookie 的过期时间，这也会提示用户登录。它们之间的区别在于，actor cookie 的过期时间只影响浏览器会话，仍然可以通过编程使用，但当会话过期时，它也不能再以编程方式使用，因为它是以 JWT 的形式创建的，并带有过期声明。
2. **个人访问令牌**： 这些是通过 DataHub 设置面板生成的令牌，用于与 DataHub API 交互。
与 DataHub API 交互。它们可用于自动化流程，如丰富 DataHub 上的文档、所有权、标签等。了解
有关个人访问令牌的更多信息 [此处](personal-access-tokens.md)。

要了解有关 DataHub 后台身份验证的更多信息，请查看[元数据服务身份验证介绍](introducing-metadata-service-authentication.md)。

在向 DataHub API 层发出的任何请求中，必须在**授权**标头内以承载器标记的形式提供凭据。

```shell
Authorization: Bearer <your-token>
```

请注意，在 DataHub 本地快速启动中，为方便起见，后端层的身份验证被禁用。这使得后端容易受到未验证请求的影响，因此不应在生产中使用。要启用要启用后端（基于令牌）身份验证，只需为 datahub-gms 框架设置 `METADATA_SERVICE_AUTH_ENABLED=true` 环境变量即可。
即可。

### 参考资料

有关 DataHub 中用户和组主题的快速视频，请参阅 [DataHub 基础知识 - 用户、组和身份验证 101
](https://youtu.be/8Osw6p9vDYY)
