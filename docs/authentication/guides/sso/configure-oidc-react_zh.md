# OIDC身份验证

DataHub React 应用程序支持基于 [Pac4j Play](https://github.com/pac4j/play-pac4j) 库的 OIDC 身份验证。
这使 DataHub 的操作员能够与第三方身份提供商（如 Okta、Google、Keycloak 等）集成，对用户进行身份验证。

## 1.在身份供应商处注册应用程序

## 2.获取客户端凭证和发现 URL

此步骤的目标应是获取以下值，这些值需要在部署 DataHub 之前进行配置：

- **Client ID** - 身份提供商为您的应用程序提供的唯一标识符
- **Client Secret** - 用于您和身份提供商之间交换的共享密文
- **Discovery URL** - 可以发现身份提供商 OIDC API 的 URL。后缀应为`.well-known/openid-configuration`。有时，身份提供商不会在其设置指南中明确包含此 URL，尽管根据 OIDC 规范，该端点将存在。有关详细信息，请参阅 <http://openid.net/specs/openid-connect-discovery-1_0.html>。

进一步操作：

- **获取客户证书**
- **获取客户端凭据**
- **获取发现 URI**
- **获取应用程序（客户端）ID**
- **获取发现 URI**

## 3.配置 DataHub 前端服务器

### Docker

启用OIDC的下一步是配置`datahub-frontend`以启用身份提供商的OIDC身份验证。

为此，必须更新 `datahub-frontend` [docker.env](../../../../docker/datahub-frontend/env/docker.env) 文件，使用从身份提供程序接收的值：

```env
# Required Configuration Values:
AUTH_OIDC_ENABLED=true
AUTH_OIDC_CLIENT_ID=your-client-id
AUTH_OIDC_CLIENT_SECRET=your-client-secret
AUTH_OIDC_DISCOVERY_URI=your-provider-discovery-url
AUTH_OIDC_BASE_URL=your-datahub-url
```

| 配置 | 说明 | 默认值 |
| - | - | - |
| AUTH_OIDC_ENABLED | 启用将身份验证委托给 OIDC 身份提供程序的功能。||
| AUTH_OIDC_CLIENT_ID | 从身份提供者收到的唯一客户端 ID | |
| AUTH_OIDC_CLIENT_SECRET | 从身份提供程序接收的唯一客户端密文| |
| AUTH_OIDC_DISCOVERY_URI | 身份提供程序 OIDC 发现 API 的位置。以 `.well-known/openid-configuration` 为后缀。| |
| AUTH_OIDC_BASE_URL | DataHub 部署的基本 URL，例如 <https://yourorgdatahub.com> (prod) 或 <http://localhost:9002> (testing) | |
| AUTH_SESSION_TTL_HOURS | 提示用户再次登录前的时间长度（小时）。控制浏览器中行为者 cookie 的过期时间。数值转换为小时数。 | 24 |
| MAX_SESSION_TOKEN_AGE | 确定会话令牌的过期时间。会话令牌是无状态的，因此这决定了会话令牌何时不能再使用，而有效的会话令牌可一直使用到过期为止。接受有效的相对 Java 日期样式字符串。| 24h |

提供这些配置将使 DataHub 将身份验证委托给您的身份提供商，请求 `oidc email profile` 作用域，并将来自已验证配置文件的 “preferred_username” 声明解析为 DataHub CorpUser 身份。

> 注 默认情况下，DataHub 公开的登录回调端点位于 `${AUTH_OIDC_BASE_URL}/callback/oidc`。这必须**与您在步骤 1 中向身份提供商注册的登录重定向 URL 完全**匹配。

### Kubernetes

在 Kubernetes 中，你可以如下在 `values.yaml` 中添加上述环境变量。

```yaml
datahub-frontend:
  ...
  extraEnvs:
    - name: AUTH_OIDC_ENABLED
      value: "true"
    - name: AUTH_OIDC_CLIENT_ID
      value: your-client-id
    - name: AUTH_OIDC_CLIENT_SECRET
      value: your-client-secret
    - name: AUTH_OIDC_DISCOVERY_URI
      value: your-provider-discovery-url
    - name: AUTH_OIDC_BASE_URL
      value: your-datahub-url
```

你也可以将 OIDC 客户端秘密(secrets)打包成 k8s 秘密(secret)，方法是运行

```shell
kubectl create secret generic datahub-oidc-secret --from-literal=secret=<<OIDC SECRET>>
```

然后按如下方式设置 secret env。

```yaml
- name: AUTH_OIDC_CLIENT_SECRET
  valueFrom:
    secretKeyRef:
      name: datahub-oidc-secret
      key: secret
```

### 高级 OIDC 配置

您可以选择使用高级配置进一步自定义流程。这些配置允许您指定所请求的 OIDC 范围、如何从身份提供程序返回的声明中解析 DataHub 用户名，以及如何从 OIDC 声明集中提取和供应用户和组。

```properties
# Optional Configuration Values:
AUTH_OIDC_USER_NAME_CLAIM=your-custom-claim
AUTH_OIDC_USER_NAME_CLAIM_REGEX=your-custom-regex
AUTH_OIDC_SCOPE=your-custom-scope
AUTH_OIDC_CLIENT_AUTHENTICATION_METHOD=authentication-method
```

| 配置 | 说明 | 默认值 |
| - | - | - |
| AUTH_OIDC_USER_NAME_CLAIM | 包含 DataHub 平台上使用的用户名的属性。默认情况下，这是作为标准电子邮件范围的一部分提供的 `email`。 | |
| AUTH_OIDC_USER_NAME_CLAIM_REGEX | 用于从 userNameClaim 属性中提取用户名的 regex 字符串。例如，如果 userNameClaim 字段将包含电子邮件地址，而我们希望省略电子邮件的域名后缀，我们可以指定一个自定义 regex 来实现这一目的。(例如`([^@]+)`) | |
| AUTH_OIDC_SCOPE | 一个字符串，代表终端用户授予身份提供者的范围。更多信息，请参阅 [OpenID Connect Scopes](https://auth0.com/docs/scopes/openid-connect-scopes)。 | |
| AUTH_OIDC_CLIENT_AUTHENTICATION_METHOD | 代表与身份提供程序一起使用的令牌验证方法的字符串。默认值为 `client_secret_basic`，使用 HTTP Basic 身份验证。另一个选项是 `client_secret_post`，它将 client_id 和 secret_id 作为表单参数包含在 HTTP POST 请求中。更多信息，请参阅[OAuth 2.0 客户端身份验证](https://darutk.medium.com/oauth-2-0-client-authentication-4b5f929305d4) | client_secret_basic |
| AUTH_OIDC_PREFERRED_JWS_ALGORITHM | 可用于选择 id 标记的首选签名算法。示例包括 RS256或HS256。如果您的 IdP 在签名算法列表中的`RS256`/`HS256`前包含`none`，则必须设置该值。 | |

### 用户和组供应（JIT供应）

默认情况下，DataHub 会乐观地尝试供应登录时尚未存在的用户和组。
对于用户，我们提取名、姓、显示名和电子邮件等信息来构建基本用户配置文件。如果存在群组，我们只需提取其名称。

默认配置行为可通过以下配置进行自定义。

```properties
# User and groups provisioning
AUTH_OIDC_JIT_PROVISIONING_ENABLED=true
AUTH_OIDC_PRE_PROVISIONING_REQUIRED=false
AUTH_OIDC_EXTRACT_GROUPS_ENABLED=false
AUTH_OIDC_GROUPS_CLAIM=<your-groups-claim-name>
```

| 配置 | 说明 | 默认值 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| AUTH_OIDC_JIT_PROVISIONING_ENABLED | 如果 DataHub 用户和组不存在，是否应在登录时配置。 | true |
| AUTH_OIDC_PRE_PROVISIONING_REQUIRED | 用户登录时是否应已存在于 DataHub，如果不存在则登录失败。这适用于批量摄取用户和组并在环境中严格控制的情况。 | false |
| AUTH_OIDC_EXTRACT_GROUPS_ENABLED | 仅适用于 `AUTH_OIDC_JIT_PROVISIONING_ENABLED` 设为 true 的情况。这将决定我们是否应尝试从 OIDC 属性中的特定索赔中提取组名称列表。请注意，如果启用该功能，每次登录都会重新同步身份供应商中的群组成员资格，清除通过DataHub用户界面分配的群组成员资格。谨慎启用！| false |
| AUTH_OIDC_GROUPS_CLAIM | 仅当 `AUTH_OIDC_EXTRACT_GROUPS_ENABLED` 设置为 “true” 时才适用。这决定了哪些 OIDC claims将包含字符串组名列表。接受以逗号分隔的多个claims名称。例如：“groups, teams, departments”。 | groups |

## 4.重启 datahub-frontend-react

配置完成后，重启 `datahub-frontend-react` 容器将启用间接身份验证流，其中 DataHub 将身份验证委托给指定的身份提供程序。

```shell
docker-compose -p datahub -f docker-compose.yml -f docker-compose.override.yml up datahub-frontend-react
```

导航到 DataHub 域，查看 SSO 的运行情况。

> 注意
默认情况下，启用 OIDC 将不会禁用虚拟 JAAS 身份验证路径，该路径可通过 React 应用程序的 `/login` 路由访问。要禁用此身份验证路径，请另外指定以下配置：`AUTH_JAAS_ENABLED=false`

## 摘要

一旦用户通过身份提供商的身份验证，DataHub 将从提供的声明中提取一个用户名并通过设置一对会话 cookie 授予 DataHub 对用户的访问权限。

用户浏览 React 应用程序时发生的步骤简述如下：

1. 向 `datahub-frontend` 服务器中的 `/authenticate` 端点发起 `GET`
2. `/authenticate` 会尝试通过会话 cookie 对请求进行身份验证
3. 如果验证失败，服务器将重定向到身份供应商的登录体验
4. 用户通过身份供应商登录
5. 身份供应商验证用户身份，并重定向到 DataHub 已注册的登录重定向 URL，提供一个授权码，授权码可用于代表用户检索信息。
6. DataHub 获取认证用户的配置文件并提取用户名，以在 DataHub 上识别用户（如 urn:li:corpuser:username）
7. DataHub 为新认证的用户设置会话 Cookie
8. DataHub 将用户重定向到主页（“/”）

## 疑难解答

1. 没有用户可以登录。相反，我被重定向到登录页面，并显示错误。我该怎么办？

    出现这种情况有多种原因，但最常见的原因是单点登录配置错误，可能在 DataHub 端，也可能在身份供应商端。

    - 确认所有值都一致（如部署 DataHub 的主机 URL），且没有拼写错误的值（客户 ID、客户密 码）。
    - 确认您的身份提供商支持请求的范围，且您的身份提供商支持 DataHub 用于唯一标识用户的声明（即属性）（请参阅身份提供商 OpenID Connect 文档）。默认情况下，该声明为 `email`。
    - 确保您配置的发现 URI（`AUTH_OIDC_DISCOVERY_URI`）在运行 datahub-frontend 容器的地方可以访问。您可以向该地址发送一个基本的CURL（**专业提示**：您也可以在浏览器中访问该地址，查看有关身份供应商的更多具体细节）。
    - 检查 “datahub-frontend” 容器的容器日志。希望这能提供登录切换失效的更多原因。

    如果其他方法都不奏效，请随时联系 Slack 上的 DataHub 社区以获得实时支持。

2. 当用户尝试登录时，我在 `datahub-frontend` 日志中看到一个错误：`Caused by: java.lang.RuntimeException: Failed to resolve user name claim from profile provided by Identity Provider. Missing attribute. Attribute: 'email', Regex: '(.*)', Profile: &#123; ....`

    这表明您的身份供应商没有提供名称为“email”的声明，而 DataHub 默认使用该名称唯一标识贵机构内的用户。

    要解决这个问题，您可能需要

    1. 通过更改 `AUTH_OIDC_USER_NAME_CLAIM`（如改为“name”或“preferred*username”），将作为唯一用户标识符的声明改为其他名称。
    2. 更改环境变量 `AUTH_OIDC_SCOPE` 以包含检索名称为“email”的请求所需的范围

    对于 `datahub-frontend` 容器 /pod。

## 参考

请查阅您的身份供应商的文档，以了解所支持的范围声明的更多信息。

- [Keycloak - 保护应用程序和服务指南](https://www.keycloak.org/docs/latest/securing_apps/)
