# 将用户接入 DataHub

可通过 3 种方式在 DataHub 上配置新用户帐户：

1. 共享邀请链接
2. 使用 OpenID Connect 单点登录
3. 静态凭证配置文件（仅限自托管）

第一个选项最容易上手。建议在生产中部署 DataHub 时使用第二种方式。第三个选项应保留给必须密切监视和控制访问的特殊情况，并且仅适用于自托管实例。

## 共享邀请链接

### 生成邀请链接

如果拥有 `Manage User Credentials`，则可通过共享邀请链接邀请新用户访问 DataHub。

为此，请导航到 “设置 ”页面内的 “用户和组”部分。在此，您可以单击 “邀请用户”按钮生成可共享的邀请链接。如果您没有邀请用户的正确权限，此按钮将被禁用。

![invite-users-button](https://raw.githubusercontent.com/datahub-project/static-assets/master/imgs/invite-users-button.png)

要邀请新用户，只需与组织内的其他人分享链接即可。

当新用户访问该链接时，他们将被引导到一个注册屏幕，在那里他们可以创建自己的 DataHub 帐户。

### 重置用户密码

要重置用户密码，请导航至 “用户和组” 选项卡，找到需要重置密码的用户、
然后单击右侧菜单下拉菜单中的**重置用户密码**。请注意，用户必须拥有`Manage User Credentials`[平台权限](../../authorization/access-policies-guide.md)才能重置密码。

![reset-user-password-button](https://raw.githubusercontent.com/datahub-project/static-assets/master/imgs/reset-user-password-button.png)

要重置密码，只需与需要更改密码的用户共享密码重置链接即可。密码重置链接会在 24 小时后失效。

## 使用 OpenID Connect 配置单点登录

通过 OpenID Connect 设置单点登录可使您组织的用户通过中央身份提供程序登录 DataHub，例如

- Azure AD
- Okta
- Keycloak
- Ping!
- Google Identity

等。

强烈建议在 DataHub 的生产部署中使用此选项。

### 管理DataHub

单点登录可通过导航至 **Settings** > **SSO** > **OIDC** 进行配置和启用。注意
用户必须拥有**`Manage User Credentials`**，才能配置单点登录设置。
才能配置 SSO 设置。

要完成集成，您需要具备以下条件：

1. **Client ID** - 身份提供商为您的应用程序提供的唯一标识符。
2. **Client Secret** - 您与身份提供商之间用于交换的共享密文
3. **Discovery URL** - 可以发现身份供应商 OpenID 设置的 URL。

这些值可根据[OpenID Connect Authentication](sso/configure-oidc-react_zh.md)指南中的步骤1从身份供应商处获得。

### 自托管 DataHub

有关配置 Self-Hosted DataHub 以使用 OpenID Connect (OIDC) 执行身份验证的信息，请查看 OIDC Authentication。

> 关于用户 URN 的说明： 用户URN是DataHub上用户的唯一标识符。当用户通过OIDC登录DataHub时，从身份提供商处收到的用户名将用于构建该用户在DataHub上的唯一标识符。urn计算公式为：`urn:li:corpuser:<extracted-username>`。
默认情况下，电子邮件地址将是从身份供应商提取的用户名。有关在Datahub中自定义作为用户名的主张的信息，请查阅OIDC身份验证文档。

### 静态证书配置文件（仅限自托管）

可通过包含静态用户名和密码组合的 [JaaS](jaas.md) 身份验证配置文件管理用户凭证。默认情况下，根用户 “datahub” 的凭据就是使用这种机制配置的。强烈建议管理员更改或删除该用户的默认凭据

#### 使用 user.props 文件添加新用户

要定义一组允许登录 DataHub 的用户名/密码组合（除根 “datahub ”用户外），请在 `datahub-frontend-react` 容器或 pod 中的文件路径 `${HOME}/.datahub/plugins/frontend/auth/user.props` 下创建名为 `user.props` 的新文件。

该文件应包含用户名：密码规格，每行一个。例如，要创建 2 个新用户，用户名分别为 “janesmith” 和 “johndoe”，我们需要定义以下文件：

```props
// custom user.props
janesmith:janespassword
johndoe:johnspassword
```

保存文件后，只需启动 DataHub 容器并导航到 `http://localhost:9002/login` 以验证新凭据是否有效。

要更改或删除现有登录凭据，请编辑并保存 `user.props` 文件。然后重新启动 DataHub 容器。

如果要自定义 `user.props` 文件的位置，或通过 Helm 部署 DataHub，请继续执行步骤 2。

#### （高级）将自定义 user.props 文件挂载到容器

只有在将自定义凭证挂载到 Kubernetes pod（例如 Helm）***or*** 如果你想更改 DataHub 挂载自定义`user.props`文件的默认文件系统位置（`${HOME}/.datahub/plugins/frontend/auth/user.props)`）时，才需要执行此步骤。

如果使用 `datahub docker quickstart` 进行部署，或使用 Docker Compose 运行，则可以跳过此步骤。

##### Docker Compose

你需要修改 `docker-compose.yml` 文件，以挂载一个容器卷，将你的自定义 user.props 映射到容器内的标准位置（`/etc/datahub/plugins/frontend/auth/user.props`）。

例如，要挂载存储在本地文件系统 `/tmp/datahub/user.props`中的 user.props 文件，我们需要修改 `datahub-web-react` 配置的 YAML，使其看起来像下面这样：

```aidl
  datahub-frontend-react:
    build:
      context: ../
      dockerfile: docker/datahub-frontend/Dockerfile
    image: acryldata/datahub-frontend-react:${DATAHUB_VERSION:-head}
    .....
    # The new stuff
    volumes:
      - ${HOME}/.datahub/plugins:/etc/datahub/plugins
      - /tmp/datahub:/etc/datahub/plugins/frontend/auth
```

进行此更改后，重新启动 DataHub 即可启用已配置用户的身份验证。

##### Helm

您需要创建一个 Kubernetes 秘密，然后将该文件作为卷挂载到 `datahub-frontend` pod。

首先，从本地的 `user.props` 文件创建一个秘密

```shell
kubectl create secret generic datahub-users-secret --from-file=user.props=./<path-to-your-user.props>
```

然后，配置 `values.yaml` 以将卷添加到 `datahub-frontend` 容器。

```YAML
datahub-frontend:
  ...
  extraVolumes:
    - name: datahub-users
      secret:
        defaultMode: 0444
        secretName:  datahub-users-secret
  extraVolumeMounts:
    - name: datahub-users
      mountPath: /etc/datahub/plugins/frontend/auth/user.props
      subPath: user.props
```

请注意，如果更新了密文，就需要重启 `datahub-frontend` pod，这样更改才会被反映出来。要就地更新秘密，可以运行以下命令。

```shell
kubectl create secret generic datahub-users-secret --from-file=user.props=./<path-to-your-user.props> -o yaml --dry-run=client | kubectl apply -f -
```

> 关于用户 URN 的说明： 用户 URN 是 DataHub 用户的唯一标识符。在 `user.props` 文件中定义的用户名将用于生成 DataHub 用户 “urn”，它可唯一标识
> DataHub 上的用户。urn 的计算方法是 `urn:li:corpuser:{username}`，其中 “username 已在 user.props 文件中定义”。

## 更改默认的 “datahub ”用户证书（推荐）

请参阅[更改默认用户证书](../changing-default-credentials.md)。

## 注意事项

### 添加用户详细信息

如果在`user.props`文件中添加新的用户名/密码，DataHub 中将不存在关于用户的其他信息（全名、电子邮件、简历等）。
用户的其他信息（全名、电子邮件、简历等）。这意味着您将无法通过搜索找到该用户。

要使用户变得可搜索，只需导航到新用户的配置文件页面（右上角）并点击**编辑个人资料**。添加一些详细信息，如显示名称、电子邮件等。然后点击**保存**。现在您应该可以
通过搜索找到该用户。

> 您还可以使用我们的 Python Emitter SDK，通过 CorpUser 元数据实体生成有关新用户的自定义信息。

## 常见问题

1. 我可以同时启用 OIDC 和用户名/密码 (JaaS) 身份验证吗？

可以！如果您没有通过 datahub 前端容器上的环境变量 (AUTH_JAAS_ENABLED) 明确禁用 JaaS、那么您可以在 `http://your-datahub-url.com/login` 访问标准登录流程。
