---
title： “datahub-frontend”
---

# DataHub 前端代理

DataHub 前端是一个用 Java 编写的 [Play](https://www.playframework.com/) 服务。它是后端服务 [DataHub GMS](../metadata-service) 和 [DataHub Web](../datahub-web-react/README.md) 之间的中间层。

## 前提条件

* 你需要在你的机器上安装 [JDK11](https://openjdk.org/projects/jdk/11/)，才能构建 “DataHub Frontend”。
* 由于 UI 测试依赖于 `Google Chrome`，因此需要安装 [Chrome](https://www.google.com/chrome/) 网页浏览器才能构建。

## 构建

作为顶级构建的一部分，`DataHub Frontend` 已经构建：

```bash
./gradlew build
```

不过，如果你只想专门构建 `DataHub Frontend` ：

```bash
./gradlew :datahub-frontend:dist
```

## 依赖关系

在启动 `DataHub Frontend` 之前，您需要确保 [DataHub GMS](../metadata-service) 及其所有依赖项已经启动并运行。

## 通过 Docker 映像启动

试用 `DataHub Frontend` 的最快方法是运行 [Docker 镜像](../docker/datahub-frontend)。

## 通过命令行启动

如果你修改了一些东西，并想在不构建 Docker 镜像的情况下快速试用，也可以在成功[构建](#构建)后直接从命令行运行应用程序：

```shell
cd datahub-frontend/run && ./run-local-frontend
```

## 检查 DataHub UI

用上述两种方法之一启动应用程序后，您可以在最喜欢的网络浏览器中输入以下内容来连接它：<http://localhost:9002>

要登录，您需要提供用户名。默认账户是 `datahub`，密码是 `datahub`。

## 身份验证

DataHub 前端利用 [Java Authentication and Authorization Service (JAAS)](https://docs.oracle.com/javase/7/docs/technotes/guides/security/jaas/JAASRefGuide.html)执行身份验证。默认情况下，我们提供了一个 [DummyLoginModule](app/security/DummyLoginModule.java)，它将接受任何用户名/密码组合。您可以更新[jaas.conf](conf/jaas.conf)，以满足您的身份验证要求。例如，使用以下配置进行基于 LDAP 的身份验证、

```conf
WHZ-Authentication {
  com.sun.security.auth.module.LdapLoginModule sufficient
  userProvider="ldaps://<host>:636/dc=<domain>"
  authIdentity="{USERNAME}"
  userFilter="(&(objectClass=person)(uid={USERNAME}))"
  java.naming.security.authentication="simple"
  debug="false"
  useSSL="true";
};
```

### React 中的身份验证

React 应用程序既支持上文所述的 JAAS，也支持单独的 OIDC 身份验证。要了解如何为 React 配置 OIDC，请参阅[OIDC in React](../docs/authentication/guides/sso/configure-oidc-react_zh.md)文档。

### API 调试

大多数 DataHub 前端 API 端点都使用[Play Authentication](https://www.playframework.com/documentation/2.1.0/JavaGuide4)进行保护，这意味着请求通过时需要在 cookie 中存储验证信息。这使得使用 curl 进行调试变得困难。一种方法是先对 `/authenticate` 端点进行 curl 调用，然后将验证信息存储在 cookie 文件中，如下所示

```shell
curl -c cookie.txt -d '{"username":"datahub", "password":"datahub"}' -H 'Content-Type: application/json' http://localhost:9002/authenticate
```

然后，您可以使用相同的 cookie 文件进行所有后续调用，以通过身份验证检查。

```shell
curl -b cookie.txt "http://localhost:9001/api/v2/search?type=dataset&input=page"
```
