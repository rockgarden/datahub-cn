# [如何从 DataHub 容器提取日志](https://datahubproject.io/docs/how/extract-container-logs)

DataHub 容器、datahub GMS（后端服务器）和 datahub 前端（用户界面服务器）会将日志文件写入本地容器文件系统。要提取这些日志，需要从服务正在运行的容器内部获取。

如果使用 vanilla docker 或 compose 进行部署，可以使用 Docker CLI，如果使用 K8s，则可以使用 kubectl。

## 第1步：找到你感兴趣的容器的id

首先，你需要获取要提取日志的容器的 id。例如，datahub-gms。

### Docker 和 Docker Compose

为此，你可以运行以下命令查看 Docker 知道的所有容器：

```shell
johnjoyce@Johns-MBP datahub-fork % docker container ls
CONTAINER ID   IMAGE                                   COMMAND                  CREATED      STATUS                  PORTS                                                      NAMES
6c4a280bc457   acryldata/datahub-frontend-react   "datahub-frontend/bi…"   5 days ago   Up 46 hours (healthy)   0.0.0.0:9002->9002/tcp                                     datahub-frontend-react
122a2488ab63   acryldata/datahub-gms              "/bin/sh -c /datahub…"   5 days ago   Up 5 days (healthy)     0.0.0.0:8080->8080/tcp                                     datahub-gms
7682dcc64afa   confluentinc/cp-schema-registry:5.4.0   "/etc/confluent/dock…"   5 days ago   Up 5 days               0.0.0.0:8081->8081/tcp                                     schema-registry
3680fcaef3ed   confluentinc/cp-kafka:5.4.0             "/etc/confluent/dock…"   5 days ago   Up 5 days               0.0.0.0:9092->9092/tcp, 0.0.0.0:29092->29092/tcp           broker
9d6730ddd4c4   neo4j:4.0.6                             "/sbin/tini -g -- /d…"   5 days ago   Up 5 days               0.0.0.0:7474->7474/tcp, 7473/tcp, 0.0.0.0:7687->7687/tcp   neo4j
c97edec663af   confluentinc/cp-zookeeper:5.4.0         "/etc/confluent/dock…"   5 days ago   Up 5 days               2888/tcp, 0.0.0.0:2181->2181/tcp, 3888/tcp                 zookeeper
150ba161cf26   mysql:8.2                               "docker-entrypoint.s…"   5 days ago   Up 5 days               0.0.0.0:3306->3306/tcp, 33060/tcp                          mysql
4b72a3eab73f   elasticsearch:7.9.3                     "/tini -- /usr/local…"   5 days ago   Up 5 days (healthy)     0.0.0.0:9200->9200/tcp, 9300/tcp                           elasticsearch
```

在这种情况下，我们要注意的容器 id 是 122a2488ab63，它对应于 datahub-gms 服务。

### Kubernetes 和 Helm

使用以下命令查找你感兴趣的 pod 名称：

```shell
kubectl get pods
...
default   datahub-frontend-1231ead-6767                        1/1     Running     0          42h
default   datahub-gms-c578b47cd-7676                           1/1     Running     0          13d
...
```

在这种情况下，我们要注意的 pod 名称是 datahub-gms-c578b47cd-7676，它包含 GMS 后端服务。

## 第2步：查找日志文件

第二步是查看所有日志文件。日志文件将存放在容器内，每个服务都位于以下目录下：

- datahub-gms：/tmp/datahub/logs/gms
- datahub-frontend：/tmp/datahub/logs/datahub-frontend

收集 2 种类型的日志：

1. 信息日志：包括信息、警告和错误日志行。容器运行时，它们会打印到 stdout。
2. 调试日志：这些文件的保留时间较短（超过 1 天），但包括 DataHub 代码中更细粒度的调试信息。我们忽略 DataHub 依赖的外部库的调试日志。

### Docker 和 Docker Compose

由于日志文件是根据当前日期命名的，因此您需要使用"ls"查看当前存在的文件。为此，你可以使用在第一步中记录的容器 ID，使用 docker exec 命令：

`docker exec --privileged <container-id> <shell-command>`

例如

```shell
johnjoyce@Johns-MBP datahub-fork % docker exec --privileged 122a2488ab63 ls -la /tmp/datahub/logs/gms 
total 4664
drwxr-xr-x    2 datahub  datahub       4096 Jul 28 05:14 .
drwxr-xr-x    3 datahub  datahub       4096 Jul 23 08:37 ..
-rw-r--r--    1 datahub  datahub    2001112 Jul 23 23:33 gms.2021-23-07-0.log
-rw-r--r--    1 datahub  datahub      74343 Jul 24 20:29 gms.2021-24-07-0.log
-rw-r--r--    1 datahub  datahub      70252 Jul 25 17:56 gms.2021-25-07-0.log
-rw-r--r--    1 datahub  datahub     626985 Jul 26 23:36 gms.2021-26-07-0.log
-rw-r--r--    1 datahub  datahub     712270 Jul 27 23:59 gms.2021-27-07-0.log
-rw-r--r--    1 datahub  datahub     867707 Jul 27 23:59 gms.debug.2021-27-07-0.log
-rw-r--r--    1 datahub  datahub       3563 Jul 28 05:26 gms.debug.log
-rw-r--r--    1 datahub  datahub     382443 Jul 28 16:16 gms.log
```

根据您的问题，您可能有兴趣查看调试和正常信息日志。

### Kubernetes 和 Helm

由于日志文件是根据当前日期命名的，因此需要使用"ls"查看当前存在哪些文件。为此，你可以使用 kubectl exec 命令，并使用第一步中记录的 pod 名称：

```shell
kubectl exec datahub-gms-c578b47cd-7676 -n default -- ls -la /tmp/datahub/logs/gms

total 36388
drwxr-xr-x    2 datahub  datahub       4096 Jul 29 07:45 .
drwxr-xr-x    3 datahub  datahub         17 Jul 15 08:47 ..
-rw-r--r--    1 datahub  datahub     104548 Jul 15 22:24 gms.2021-15-07-0.log
-rw-r--r--    1 datahub  datahub      12684 Jul 16 14:55 gms.2021-16-07-0.log
-rw-r--r--    1 datahub  datahub    2482571 Jul 17 14:40 gms.2021-17-07-0.log
-rw-r--r--    1 datahub  datahub      49120 Jul 18 14:31 gms.2021-18-07-0.log
-rw-r--r--    1 datahub  datahub      14167 Jul 19 23:47 gms.2021-19-07-0.log
-rw-r--r--    1 datahub  datahub      13255 Jul 20 22:22 gms.2021-20-07-0.log
-rw-r--r--    1 datahub  datahub     668485 Jul 21 19:52 gms.2021-21-07-0.log
-rw-r--r--    1 datahub  datahub    1448589 Jul 22 20:18 gms.2021-22-07-0.log
-rw-r--r--    1 datahub  datahub      44187 Jul 23 13:51 gms.2021-23-07-0.log
-rw-r--r--    1 datahub  datahub      14173 Jul 24 22:59 gms.2021-24-07-0.log
-rw-r--r--    1 datahub  datahub      13263 Jul 25 21:11 gms.2021-25-07-0.log
-rw-r--r--    1 datahub  datahub      13261 Jul 26 19:02 gms.2021-26-07-0.log
-rw-r--r--    1 datahub  datahub    1118105 Jul 27 21:10 gms.2021-27-07-0.log
-rw-r--r--    1 datahub  datahub     678423 Jul 28 23:57 gms.2021-28-07-0.log
-rw-r--r--    1 datahub  datahub    1776274 Jul 28 07:19 gms.debug.2021-28-07-0.log
-rw-r--r--    1 datahub  datahub   27576533 Jul 29 09:55 gms.debug.log
-rw-r--r--    1 datahub  datahub    1195940 Jul 29 14:54 gms.log
```

下一步，我们将把特定日志文件保存到本地文件系统。

## 第3步：将容器日志文件保存到本地

这一步涉及将容器日志文件的副本保存到本地文件系统，以便进一步调查。

### Docker 和 Docker Compose

只需使用 docker exec 命令"cat"感兴趣的日志文件，并将它们路由到一个新文件。

`docker exec --privileged 122a2488ab63 cat /tmp/datahub/logs/gms/gms.debug.log > my-local-log-file.log`

现在你应该可以在本地查看日志了。

### Kubernetes 和 Helm

有几种方法可以将文件从 pod 中取出并存入本地文件。你可以使用 kubectl cp 或直接 cat 并将感兴趣的文件导入。我们将展示一个使用后一种方法的示例：

`kubectl exec datahub-gms-c578b47cd-7676 -n default -- cat /tmp/datahub/logs/gms/gms.log > my-local-gms.log`
