---
标题 “本地开发”
---

# DataHub 开发人员指南

## 要求

- [Java 17 JDK](https://openjdk.org/projects/jdk/17/)
- [Python 3.10](https://www.python.org/downloads/release/python-3100/)
- [Docker](https://www.docker.com/)
- [Docker Compose >=2.20](https://docs.docker.com/compose/)
- 内存至少为 8GB 的 Docker 引擎，以便运行测试。

在 macOS 上，可以使用 [Homebrew](https://brew.sh/)安装。

```shell
# 安装 Java
brew install openjdk@17

# 安装 Python
brew install python@3.10 # 您可能需要将其添加到 PATH 中
# 或者，你可以使用 pyenv 来管理你的 Python 版本

# 安装 docker 和 docker compose
brew install --cask docker
```

## 构建项目

如果还没有克隆仓库，请叉并克隆它

```shell
git clone https://github.com/{username}/datahub.git
```

进入版本库的根目录

```shell
cd datahub
```

使用 [gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 构建项目

```shell
./gradlew build
```

请注意，上述操作还将运行测试和大量验证，这将大大降低整个过程的速度。

我们建议根据需要对 DataHub 进行部分编译：

- 构建 Datahub 的后端 GMS（通用元数据服务）：

  ```shell
  ./gradlew :metadata-service:war:build
  ```

- 构建 Datahub 前端：

  ```shell
  ./gradlew :datahub-frontend:dist -x yarnTest -x yarnLint
  ```

- 构建 DataHub 的命令行工具：

  ```shell
  ./gradlew :metadata-ingestion:installDev
  ```

- 构建 DataHub 的文档：

  ```shell
  ./gradlew :docs-website:yarnLintFix :docs-website:build -x :metadata-ingestion:runPreFlightScript
  # 预览文档
  ./gradlew :docs-website:serve
  ```

## 部署本地版本

只需运行一次，即可在 $PATH 中安装本地 `datahub` cli 工具

```shell
cd smoke-test/
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip wheel setuptools
pip install -r requirements.txt
cd ../
```

编译并打包项目或相应模块后，就可以通过运行 docker-compose 来部署整个系统了：

```shell
./gradlew quickstart
```

替换现有部署中的任何容器。
例如，替换 datahub 的后端（GMS）：

```shell
(cd docker && COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -p datahub -f docker-compose-without-neo4j.yml -f docker-compose-without-neo4j.override.yml -f docker-compose.dev.yml up -d --no-deps --force-recreate --build datahub-gms)
```

运行本地版本的前端

```shell
(cd docker && COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -p datahub -f docker-compose-without-neo4j.yml -f docker-compose-without-neo4j.override.yml -f docker-compose.dev.yml up -d --no-deps --force-recreate --build datahub-frontend-react)
```

## IDE 支持

用于 DataHub 开发的推荐 IDE 是 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
您可以运行以下命令生成或更新 IntelliJ 项目文件。

```shell
./gradlew idea
```

在 IntelliJ 中打开 `datahub.ipr` 开始开发！

为保持一致性，请使用 [LinkedIn IntelliJ Java style](../gradle/idea/LinkedIn%20Style.xml) 导入并自动格式化代码。

### Windows兼容性

为获得最佳性能和兼容性，我们强烈建议在 Mac 或 Linux 系统上构建。
请注意，我们并不积极支持非虚拟化环境中的 Windows 系统。

如果必须使用 Windows，一种变通方法是在虚拟化环境中构建，如 VM（虚拟机）或 [WSL（Windows Subsystem for Linux）](https://learn.microsoft.com/en-us/windows/wsl)。
这种方法有助于确保构建环境保持隔离和稳定，并正确编译代码。

## 常见的编译问题

### 获取 `Unsupported class file major version 57`

您使用的 Java 版本对于 gradle 来说可能太新了。运行以下命令检查您的 Java 版本

```shell
java --version
```

虽然可以使用较新版本的 Java 构建和运行 DataHub，但我们目前仅支持 [Java 17](https://openjdk.org/projects/jdk/17/)（又称 Java 17）。

### 为 `javax.annotation.Generated` 获取 `cannot find symbol` 错误

与上一个问题类似，请使用 Java 17 构建项目。
您可以在一台机器上安装多个 Java 版本，并使用 `JAVA_HOME` 环境变量在它们之间切换。详情请参见 [本文](https://docs.oracle.com/cd/E21454_01/html/821-2531/inst_jdk_javahome_t.html)。

### `:metadata-models:generateDataTemplate` 任务失败，出现 `java.nio.file.InvalidPathException： Illegal char <:> at index XX` 或 `Caused by: java.lang.IllegalArgumentException: 'other' has different root` 错误

由于 Pegasus 插件中的一个错误，在 Windows 上构建项目时会出现[已知问题](https://github.com/linkedin/rest.li/issues/287)。请参阅[Windows兼容性](#windows兼容性)。

### 与`generateDataTemplate`或其他`generate`任务有关的各种错误

由于我们会从模型生成大量文件，因此生成的旧文件可能会与新模型更改发生冲突。发生这种情况时，只需清除 `./gradlew` 即可解决问题。

### `任务':metadata-service:restli-servlet-impl:checkRestModel'`执行失败

这通常意味着 GMS 中的 rest.li API 引入了 [incompatible change](https://linkedin.github.io/rest.li/modeling/compatibility_check)。您需要运行一次以下命令来重建快照/IDL

```shell
./gradlew :metadata-service:restli-servlet-impl:build -Prest.model.compatibility=ignore
```

### `java.io.IOException: No space left on device`

这意味着您磁盘上用于构建的空间即将耗尽。请释放一些空间或尝试其他磁盘。

#### `Build failed` for task `./gradlew :datahub-frontend:dist -x yarnTest -x yarnLint`.

这可能意味着您需要更新 [Yarn](https://yarnpkg.com/getting-started/install) 版本

#### `:buildSrc:compileJava`任务失败，出现`package com.linkedin.metadata.models.registry.config does not exist`和`cannot find symbol`错误。

当前在 [buildSrc](https://github.com/datahub-project/datahub/tree/master/buildSrc) 目录中有两个符号链接，分别指向 [com.linkedin.metadata.aspect.plugins.config](https://github.com/datahub-project/datahub/blob/master/buildSrc/src/main/java/com/linkedin/metadata/aspect/plugins/config) 和 [com.linkedin.metadata.models.registry.config](https://github.com/datahub-project/datahub/blob/master/buildSrc/src/main/java/com/linkedin/metadata/models/registry/config
)软件包的目录，该目录指向 [entity-registry](https://github.com/datahub-project/datahub/tree/master/entity-registry) 子项目中的相应软件包。

当使用 Windows 10/11 签出版本库时，即使后来使用 WSL 在 `/mnt/` 中加载 Windows 文件系统进行构建，也可能没有正确创建符号链接，而是将符号链接作为普通文件签出。虽然在技术上可以使用挂载在 `/mnt/` 中的 Windows 文件系统在 WSL 中进行构建，但**强烈建议**在 Linux 文件系统（如 `/home/`）中检出版本库，然后从那里进行构建，因为从 Linux 访问 Windows 文件系统比访问 Linux 文件系统相对较慢，会拖慢整个构建过程。

要在 Windows 10/11 中创建符号链接，必须先启用[开发者模式](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development)。然后使用以下命令启用[Git 中的符号链接](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)并重新创建符号链接：

```shell
# 启用 core.symlinks 配置
git config --global core.symlinks true

# 检查当前的 core.symmlinks 配置和作用域
git config --show-scope --show-origin core.symlinks

# 如果本地的 core.sysmlinks 配置仍设置为 false，则移除本地配置
git config --unset core.symlinks

# 重置当前分支，以重新创建缺失的符号链接（或者，也可以将分支来回切换）
git reset --hard
```

有关如何在 Windows 10/11 和 Git 上启用符号链接的更多信息，请参阅 [此处](https://stackoverflow.com/questions/5917249/git-symbolic-links-in-windows/59761201#59761201)。
