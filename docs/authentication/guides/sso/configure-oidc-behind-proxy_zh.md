# OIDC 代理配置

在检索 openid-configuration 时，可以将 `datahub-frontend-react` 服务器配置为使用 http 代理。
如果你的基础架构被锁定，默认情况下不允许连接，那么就需要使用代理来进行细粒度的出口控制。

## 配置 http 代理和非代理主机

为此，你需要向 datahub-frontend-react 容器传递一组环境变量（例如，在 `docker-compose.yml` 文件或你的 kubernetes 清单中）。

```conf
HTTP_PROXY_HOST=host of your http proxy
HTTP_PROXY_PORT=port of your http proxy
HTTPS_PROXY_HOST=host of your http(s) proxy used for https connections (often the same as the http proxy)
HTTPS_PROXY_PORT=port of your http(s) proxy used for https connections (often the same as the http proxy)
HTTP_NON_PROXY_HOSTS=localhost|datahub-gms (or any other hosts that you would like to bypass the proxy for, delimited by pipe)
```

## 可选：提供自定义信任库

如果你的上游代理执行 SSL 终结来检查流量，这将导致 HTTPS 连接使用不同的（自签名）证书。
`datahub-frontend-react` docker 镜像中使用的默认信任库不会信任这类连接。
为了解决这个问题，你可以将自己的信任库（由代理或网络管理员提供）复制或挂载到 docker 容器中。

根据你的设置，有几种方法可以实现这一点：

### 在前端提供信任库

#### 选项 a）在前端 docker 镜像中加入自己的信任存储

要为你的前端构建一个内置证书的自定义镜像，你可以使用官方的前端镜像作为基础，然后复制你需要的文件。

示例 Dockerfile：

```dockerfile
FROM acryldata/datahub-frontend-react:<version>
COPY /truststore-directory /certificates
```

构建这个 Dockerfile 后，你就能在本地机器上生成自己的定制 docker 镜像。
然后，你就可以对其进行标记、发布到自己的注册表等。

#### 备选方案 b）使用 docker 卷从主机挂载 truststore

调整你的 docker-compose.yml，在 `datahub-frontend-react` 容器中加入一个新的卷挂载

```docker
  datahub-frontend-react:
    # ...
    volumes:
      # ...
      - /truststore-directory:/certificates
```

### 引用新的信任存储

向 `datahub-frontend-react` 容器添加以下环境值：

```conf
SSL_TRUSTSTORE_FILE=path/to/truststore.jks (e.g. /certificates)
SSL_TRUSTSTORE_TYPE=jks
SSL_TRUSTSTORE_PASSWORD=MyTruststorePassword
```

完成这些步骤后，前端容器在验证 SSL/HTTPS 连接时就会使用新的信任存储。
