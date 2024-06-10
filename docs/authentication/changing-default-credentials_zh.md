# 更改默认用户证书

## 默认用户证书

默认情况下会为你创建 “datahub” 根用户。该用户通过 [user.props](../../datahub-frontend/conf/user.props) 文件控制，[JaaS 身份验证](./guides/jaas.md) 被配置为使用该文件：

默认情况下，每个自托管 DataHub 部署的凭证文件都是这样的：

```log
// default user.props
datahub:datahub
```

显然，从安全角度来看，这并不理想。强烈建议 在您的组织将 DataHub 部署到生产环境之前进行更改。

> 警告
请注意，在用户界面中删除 “Data Hub ”用户**不会**禁用默认用户。
您仍可使用默认的 “datahub:datahub” 凭据登录。
要安全删除默认凭据，请按照下面提供的指南操作。

## 更改默认用户 "datahub"

更改默认用户的方法取决于 DataHub 的部署方式。

- [Helm chart](#helm-chart)
  - [Deployment Guide](/docs/deploy/kubernetes.md)
- [Docker-compose](#docker-compose)
  - [Deployment Guide](../../docker/README.md)
- [Quickstart](#quickstart)
  - [Deployment Guide](/docs/quickstart.md)

### Helm chart

您需要创建一个 Kubernetes 秘密，然后将文件作为卷挂载到 datahub-frontend pod。

1. 创建新的配置文件

    创建一个新版本 [user.props](../../datahub-frontend/conf/user.props)，其中定义了 datahub 用户的更新密码。

    要从新文件中删除用户 “datahub”，只需省略用户名即可。请注意，你也可以选择将文件留空。
    例如，要将 DataHub 根用户的密码更改为 “newpassword”，文件将包含以下内容：

    ```props
    // new user.props
    datahub:newpassword
    ```

2. 创建 kubernetes 秘密

    从本地的 `user.props` 文件创建一个秘密。

    ```shell
    kubectl create secret generic datahub-users-secret --from-file=user.props=./<path-to-your-user.props>
    ```

3. 挂载配置文件

    配置 [values.yaml](https://github.com/acryldata/datahub-helm/blob/master/charts/datahub/values.yaml#LL22C1-L22C1)，将卷添加到 datahub-frontend 容器。

    ```yaml
    datahub-frontend:
    ...
    extraVolumes:
        - name: datahub-users
        secret:
            defaultMode: 0444
            secretName:  datahub-users-secret
    extraVolumeMounts:
        - name: datahub-users
        mountPath: /datahub-frontend/conf/user.props
        subPath: user.props
    ```

4. 重启 Datahub

    重启 DataHub 容器或 pod 以获取新配置。
    例如，您可以运行以下命令升级当前的 helm 部署。

    ```shell
    helm upgrade datahub datahub/datahub --values <path_to_values.yaml>
    ```

    请注意，如果更新了密文，就需要重启 datahub 前端 pod，这样更改才会被反映出来。要就地更新秘密，可以运行以下命令。

    ```shell
    kubectl create secret generic datahub-users-secret --from-file=user.props=./<path-to-your-user.props> -o yaml --dry-run=client | kubectl apply -f -
    ```

### Docker-compose

1. 修改配置文件

    修改 [user.props](https://github.com/datahub-project/datahub/blob/master/datahub-frontend/conf/user.props)，其中定义了 datahub 用户的最新密码。

    要从新文件中删除用户 “datahub”，只需省略用户名即可。请注意，你也可以选择将文件留空。
    例如，要将 DataHub 根用户的密码更改为 “newpassword”，文件将包含以下内容：

    ```props
    // new user.props
    datahub:newpassword
    ```

2. 挂载更新的配置文件

    修改 [docker-compose.yaml](../../docker/docker-compose.yml)，使用卷：`/datahub-frontend/conf/user.props`，将更新的 user.props 文件挂载到`datahub-frontend-react`容器内的以下位置

    ```yaml
    datahub-frontend-react:
    ...
        volumes:
        ...
        - <absolute_path_to_your_custom_user_props_file>:/datahub-frontend/conf/user.props
    ```

3. 重启 DataHub

    重启 DataHub 容器或 pod 以获取新配置。

### 快速入门

1. 修改配置文件

    修改 user.props，其中定义了 datahub 用户的更新密码。

    要从新文件中删除用户 “datahub”，只需省略用户名即可。请注意，你也可以选择将文件留空。
    例如，要将 DataHub 根用户的密码更改为 “newpassword”，文件将包含以下内容：

    ```props
    // new user.props
    datahub:newpassword
    ```

2. 挂载更新后的配置文件

    在[quickstart中使用的docker-compose文件](https://github.com/datahub-project/datahub/blob/master/docker/quickstart/docker-compose.quickstart.yml)中。
    修改 [datahub-frontend-react 块](https://github.com/datahub-project/datahub/blob/master/docker/quickstart/docker-compose.quickstart.yml#L116) 以包含额外的卷挂载。

    ```yaml
    datahub-frontend-react:
    ...
        volumes:
        ...
        - <absolute_path_to_your_custom_user_props_file>:/datahub-frontend/conf/user.props
    ```

3. 重启 Datahub

    运行以下命令

    ```shell
    datahub docker quickstart --quickstart-compose-file <your-modified-compose>.yml
    ```
