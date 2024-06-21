# # DataHub 快速入门指南

## 先决条件

- 为您的平台安装 **Docker** 和 **Docker Compose** v2。

  | 平台 | 应用 |
  | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
  | 窗口 | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
  | Mac | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
  | Linux | [Docker for Linux](https://docs.docker.com/desktop/install/linux-install/) 和 [Docker Compose](https://docs.docker.com/compose/install/linux/) |
  
- 通过命令行或桌面应用程序启动 Docker 引擎。

- 确保已安装并配置 Python 3.8+。（使用 python3 --version 查看）。

> Docker 资源分配
  确保为 Docker 引擎分配足够的硬件资源。
  测试确认配置: 2 CPUs, 8GB RAM, 2GB 交换区 和 10GB 磁盘空间。

## 安装 DataHub CLI

```bash
python3 -m pip install --upgrade pip wheel setuptools
python3 -m pip install --upgrade acryl-datahub
datahub version
```

如果看到 `note Command Not Found`，请尝试运行 cli 命令，如 `python3 -m datahub version`。
请注意，DataHub CLI 不支持 Python 2.x。

```bash
poetry add acryl-datahub
poetry shell
datahub version
```

## 启动 DataHub

从终端运行以下 CLI 命令。

```bash
datahub docker quickstart
```

这将使用 [docker-compose](https://docs.docker.com/compose/) 部署 DataHub 实例。
如果你好奇，docker-compose.yaml 文件会下载到你的主目录下的 `.datahub/quickstart` 目录。

如果一切顺利，你应该会看到类似下面这样的信息：

```shell-session
Fetching docker-compose file https://raw.githubusercontent.com/datahub-project/datahub/master/docker/quickstart/docker-compose-without-neo4j-m1.quickstart.yml from GitHub
Pulling docker images...

 ⠴ mysql-setup 4 layers [⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                         144.6s 
 ⠴ kafka-setup 18 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                          144.6s 
 ⠴ datahub-gms 11 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                 144.6s 
 ⠴ datahub-upgrade 7 layers [⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                  144.6s 
 ⠴ zookeeper 2 layers [⠀⠀]      0B/0B      Pulling                                                                                                             144.6s 
 ⠴ elasticsearch 9 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                  144.6s 
 ⠴ datahub-frontend-react 8 layers [⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                          144.6s 
 ⠴ schema-registry 2 layers [⠀⠀]      0B/0B      Pulling                                                                                                       144.6s 
 ⠴ datahub-actions 27 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                             144.6s 
 ⠴ elasticsearch-setup 4 layers [⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                 144.6s 
 ⠴ mysql 12 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling                                                                                                      144.6s 
 ⠴ broker 11 layers [⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀]      0B/0B      Pulling  

Finished pulling docker images!

[+] Running 11/11
⠿ Container zookeeper                  Running                                                                                                                                                         0.0s
⠿ Container elasticsearch              Running                                                                                                                                                         0.0s
⠿ Container broker                     Running                                                                                                                                                         0.0s
⠿ Container schema-registry            Running                                                                                                                                                         0.0s
⠿ Container elasticsearch-setup        Started                                                                                                                                                         0.7s
⠿ Container kafka-setup                Started                                                                                                                                                         0.7s
⠿ Container mysql                      Running                                                                                                                                                         0.0s
⠿ Container datahub-gms                Running                                                                                                                                                         0.0s
⠿ Container mysql-setup                Started                                                                                                                                                         0.7s
⠿ Container datahub-datahub-actions-1  Running                                                                                                                                                         0.0s
⠿ Container datahub-frontend-react     Running                                                                                                                                                         0.0s
.......
✔ DataHub is now running
Ingest some demo data using `datahub docker ingest-sample-data`,
or head to http://localhost:9002 (username: datahub, password: datahub) to play around with the frontend.
Need support? Get in touch on Slack: https://slack.datahubproject.io/
```

> 注意 Mac M1/M2
  在装有 Apple Silicon（M1、M2 等）的 Mac 电脑上，你可能会看到类似 `no matching manifest for linux/arm64/v8 in the manifest list entries` 的错误。
  这通常意味着 datahub cli 无法检测到你正在 Apple Silicon 上运行它。
  要解决这个问题，可以通过发出 `datahub docker quickstart --arch m1` 来覆盖默认的架构检测。

### 登录

完成此步骤后，您应能在浏览器中导航到 DataHub 用户界面 [http://localhost:9002](http://localhost:9002)。
您可以使用下面的默认凭据登录。

```json
username: datahub
password: datahub
```

要更改默认凭证，请参阅[在quickstart中更改默认用户datahub](authentication/changing-default-credentials.md#quickstart)。

### 接收样本数据

要摄取样本元数据，请在终端运行以下 CLI 命令：

```bash
datahub docker ingest-sample-data
```

> 备注 令牌验证
  如果启用了[元数据服务身份验证](authentication/introducing-metadata-service-authentication.md)，则需要使用命令中的 `--token <token>` 参数提供个人访问令牌。

就是这样！现在就可以随意玩转 DataHub 了！

## 常见操作

### 停止 DataHub

要停止 DataHub 的快速启动，可发出以下命令。

```bash
datahub docker quickstart --stop
```

### 重置 DataHub

要清除 DataHub 的所有状态（例如，在采集您自己的状态之前），可以使用 CLI `nuke` 命令。

```bash
datahub docker nuke
```

### 升级 DataHub

如果您一直在本地测试 DataHub，但 DataHub 发布了新版本，您想尝试新版本，那么只需再次发布 quickstart 命令即可。它将下载更新的映像，并在不丢失任何数据的情况下重新启动实例。

```bash
datahub docker quickstart
```

### 自定义安装

如果你想进一步定制 DataHub 的安装，请下载 cli 工具使用的 [docker-compose.yaml](https://raw.githubusercontent.com/datahub-project/datahub/master/docker/quickstart/docker-compose-without-neo4j-m1.quickstart.yml)，根据需要进行修改，然后通过下载的 docker-compose 文件来部署 DataHub：

```bash
datahub docker quickstart --quickstart-compose-file <path to compose file>
```

### 备份 DataHub

不建议将快速启动映像用作生产实例。
但是，如果您想备份当前的 quickstart 状态（例如，您的公司即将进行演示，您想创建一份 quickstart 数据副本，以便将来恢复），可以向 quickstart 提供 `--backup` 标志。

```bash
datahub docker quickstart --backup
```

这将备份 MySQL 映像，并默认将其写入`~/.datahub/quickstart/`目录中的文件`backup.sql`。

```bash
datahub docker quickstart --backup --backup-file <path to backup file>
```

您可以通过传递 `--backup-file` 参数自定义备份文件路径。

> 注意
  请注意，快速启动备份不包括任何时间序列数据（数据集统计、配置文件等），因此如果删除所有索引并从该备份恢复，将会丢失这些信息。

### 还原 DataHub

如您所想，这些备份是可还原的。下文介绍了恢复备份的几个不同选项。

要还原以前的备份，请运行以下命令：

```bash
datahub docker quickstart --restore
```

该命令将获取位于 `~/.datahub/quickstart` 下的 `backup.sql` 文件，并用它恢复主数据库和 elasticsearch 索引。

要提供特定的备份文件，请使用 `--restore-file` 选项。

```bash
datahub docker quickstart --restore --restore-file /home/my_user/datahub_backups/quickstart_backup_2002_22_01.sql
```

另一种可能出现的情况是索引损坏或缺少更新。为了从主存储重新引导索引，可以运行此命令将索引与主存储同步。

```bash
datahub docker quickstart --restore-indices
```

有时，您可能只想还原主数据库（MySQL）的状态，而不想重新为数据编排索引。要做到这一点，必须明确禁用还原索引功能。

```bash
datahub docker quickstart --restore --no-restore-indices
```

## 接下来的步骤

- [快速启动调试指南](./troubleshooting/quickstart_zh.md)
- [通过用户界面摄取元数据](./ui-ingestion_zh.md)
- [通过CLI接收元数据](../metadata-ingestion/README_zh.md)
- [向DataHub添加用户](./authentication/guides/add-users_zh.md)
- [配置OIDC身份验证](authentication/guides/sso/configure-oidc-react_zh.md)
- [配置JaaS身份验证](authentication/guides/jaas_zh.md)
- [在DataHub后端配置身份验证](authentication/introducing-metadata-service-authentication_zh.md#配置元数据服务身份验证)。
- [在quickstart中更改默认用户datahub](authentication/changing-default-credentials_zh.md#quickstart)

### 移至生产区

> 注意事项
Quickstart 不适用于生产环境。我们建议使用 Kubernetes 将 DataHub 部署到生产环境。
我们提供了有用的 [Helm Charts](https://artifacthub.io/packages/helm/datahub/datahub)，帮助您快速启动和运行。
请查看 [将 DataHub 部署到 Kubernetes](./deploy/kubernetes.md)，了解逐步演练。

运行DataHub的 `quickstart` 方法旨在用于本地开发和快速体验DataHub提供的功能。
它不适用于生产环境。此建议基于以下几点。

#### 默认凭据

`quickstart` 使用 docker compose 配置，其中包括 DataHub 及其底层的数据存储（如 MySQL）的默认凭据。此外，其他组件开箱即未经身份验证。这是设计选择，目的是使开发更容易，但这不是生产环境的最佳做法。

#### 公开端口

DataHub 的服务和后端数据存储使用 docker 默认的绑定到所有接口地址的行为。
这对开发很有用，但不建议在生产环境中使用。

#### 性能与管理

`quickstart` 受限于单台主机上的可用资源，无法横向扩展。
新版本的推出往往需要停机时间，而且配置在很大程度上是预先确定的，不易管理。
最后，在默认情况下，`quickstart` 会遵循最新的构建，强制更新到最新发布和未发布的构建。
