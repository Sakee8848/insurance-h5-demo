# 物业保险 AI 服务 API 接口规范 (v1.0)

本文档定义了前端 H5 小程序与后端微服务之间的交互接口。
**基础 URL**: `https://api.insur-service.internal/v1`
**认证方式**: `Authorization: Bearer <JWT_TOKEN>`

## 1. 认证鉴权 (Auth)

### 用户登录
`POST /auth/login`
*   **Request**: `{ "username": "xxx", "password": "xxx" }`
*   **Response**: `{ "token": "eyJh...", "user": { "role": "PROPERTY_MGR", "org": "北京区" } }`

## 2. 理赔业务 (Claims)

### 提交报案
`POST /claims/report`
*   **Request**:
    ```json
    {
      "policy_no": "P2024001",
      "occur_time": "2024-05-20 14:30:00",
      "occur_place": "3号楼电梯间",
      "description": "电梯由于电压不稳导致停运，有人员被困后送医。",
      "risk_type": "公众责任险"
    }
    ```
*   **Response**: `{ "case_no": "CASE20240520ASDF", "status": "REPORTED" }`

### 上传理赔资料 (多模态)
`POST /claims/{case_no}/upload`
*   **Content-Type**: `multipart/form-data`
*   **Form Data**:
    *   `file`: (Binary File)
    *   `category`: "医疗发票" | "现场照片"
*   **Response**: 
    ```json
    {
      "file_url": "minio://bucket/path/img.jpg",
      "ocr_data": { "amount": 500.00, "date": "2024-05-20" },
      "ai_check": { "passed": true, "message": "发票合规" }
    }
    ```

### 获取理赔进度与预付状态
`GET /claims/{case_no}/status`
*   **Response**:
    ```json
    {
      "status": "AUDITING",
      "steps": [
        { "name": "报案", "completed": true, "time": "..." },
        { "name": "资料审核", "completed": false, "current": true }
      ],
      "pre_payment": {
        "eligible": true,
        "amount": 50000.00,
        "status": "PENDING_APPROVAL"
      }
    }
    ```

## 3. AI 智能助手 (RAG)

### 发起对话 (流式响应)
`POST /ai/chat/completions`
*   **Headers**: `Accept: text/event-stream` (SSE)
*   **Request**:
    ```json
    {
      "query": "电梯故障导致人员误工费是否在公责险赔付范围内？",
      "history": [{"role": "user", "content": "..."}] 
    }
    ```
*   **Stream Response**:
    *   `data: {"chunk": "根据", "ref": null}`
    *   `data: {"chunk": "保单条款", "ref": null}`
    *   `data: {"chunk": "第23条", "ref": "doc_id_123"}`
    *   `data: [DONE]`

### 获取引用源 (透明度)
`GET /ai/knowledge/{doc_id}`
*   **Response**:
    ```json
    {
      "title": "公众责任险条款(2024版)",
      "content_snippet": "第二十三条：...误工费属于间接损失，除特约条款外不予赔偿...",
      "page_num": 12
    }
    ```

## 4. 管理端审计 (Admin)

### 查询审计日志
`GET /admin/audit-logs`
*   **Query Params**: `?user_id=1024&start_time=...&level=SENSITIVE`
*   **Response**: List of Audit Logs.
