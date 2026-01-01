# 后端服务与脚本说明 (Server & Scripts)

本目录包含后端服务的核心逻辑设计、数据库结构与演示脚本。

## 📁 文件清单

### 1. `schema.sql` (数据库设计)
*   **用途**: 定义系统的 MySQL 数据库结构。
*   **核心表**:
    *   `users`: 支持 RBAC 权限与加密字段。
    *   `claims`: 理赔案件全流程管理。
    *   `audit_logs`: **等保三级核心**，记录所有敏感操作。
    *   `knowledge_chunks`: 向向量数据库提供映射索引。

### 2. `API_SPECS.md` (接口规范)
*   **用途**: 前后端开发的“契约文档”。
*   **核心接口**:
    *   `POST /claims/report`: 报案接口。
    *   `POST /ai/chat/completions`: **SSE 流式对话接口**。
    *   `POST /upload`: 多模态文件上传。

### 3. `rag_demo.py` (RAG 逻辑演示)
*   **用途**: 向客户演示 AI 是如何“基于事实”回答问题的，证明**数据不出内网**。
*   **运行方法**:
    ```bash
    python3 rag_demo.py
    ```
*   **演示流程**:
    1.  **用户提问** (如：电梯事故赔不赔？)。
    2.  **本地检索**: 脚本在内存中模拟检索最相关的保单条款。
    3.  **Prompt 构建**: 展示将“问题 + 检索到的条款”拼接成 Prompt 的过程。
    4.  **AI 回答**: 模拟大模型根据 Prompt 生成的安全回答。

---

## 🚀 快速验证 RAG 逻辑
如果您已安装 Python3，可以直接运行演示脚本：
```bash
cd server
python3 rag_demo.py
```
