# 查询

## ingestionSource

类型：IngestionSource

获取特定的摄取源 urn： 与摄取源相关的主键。

参数

|名称 |描述 |
|-|-|
|urn String!| |

## listIngestionSources

类型： 列表消化源结果

列出所有摄取源

参数

|名称 |描述 |
|-|-|
|input ListIngestionSourcesInput!| |

listIngestionSources样例

```json
{
    "data": {
        "listIngestionSources": {
            "start": 0,
            "count": 25,
            "total": 3,
            "ingestionSources": [
                {
                    "urn": "urn:li:dataHubIngestionSource:7f499d40-e948-4116-b48f-a92f6027d13c",
                    "name": "ea-up-travel",
                    "type": "mysql",
                    "config": {
                        "recipe": "{\"source\":{\"type\":\"mysql\",\"config\":{\"host_port\":\"118.195.171.143:3306\",\"database\":null,\"username\":\"ea_up\",\"include_tables\":true,\"include_views\":true,\"profiling\":{\"enabled\":true,\"profile_table_level_only\":false},\"stateful_ingestion\":{\"enabled\":true},\"password\":\"Eaup@Ea$tc0m\",\"database_pattern\":{\"allow\":[\"ea-up-travel\"]}}}}",
                        "version": null,
                        "executorId": "default",
                        "debugMode": true,
                        "extraArgs": [],
                        "__typename": "IngestionConfig"
                    },
                    "schedule": {
                        "interval": "0 0-1 * * *",
                        "timezone": "Asia/Shanghai",
                        "__typename": "IngestionSchedule"
                    },
                    "platform": null,
                    "executions": {
                        "start": 0,
                        "count": 1,
                        "total": 44,
                        "executionRequests": [
                            {
                                "urn": "urn:li:dataHubExecutionRequest:12e25c8b-e31a-4ee1-9ed4-6c2efed4bdd1",
                                "id": "12e25c8b-e31a-4ee1-9ed4-6c2efed4bdd1",
                                "input": {
                                    "requestedAt": 1717566655745,
                                    "__typename": "ExecutionRequestInput"
                                },
                                "result": {
                                    "status": "FAILURE",
                                    "startTimeMs": 1717566655781,
                                    "durationMs": null,
                                    "__typename": "ExecutionRequestResult"
                                },
                                "__typename": "ExecutionRequest"
                            }
                        ],
                        "__typename": "IngestionSourceExecutionRequests"
                    },
                    "__typename": "IngestionSource"
                }
            ],
            "__typename": "ListIngestionSourcesResult"
        }
    },
    "extensions": {}
}
```
