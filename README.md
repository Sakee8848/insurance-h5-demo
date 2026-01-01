# 物业保险 AI 服务项目交付物清单
# Insurance AI Service Project Deliverables

本项目旨在为 xx 物业管理公司提供一套合规、安全、高效的保险 AI 服务系统。以下是项目的所有核心交付文档与演示原型。

## 📁 1. 核心文档 (Documentation)

*   **[产品需求文档 (PRD)](./docs/PRD.md)**
    *   包含行业背景、合规性分析、详细功能需求（理赔、预付、AI）、以及项目实施路线图。
*   **[系统架构设计书 (Architecture)](./docs/ARCHITECTURE.md)**
    *   包含 **Mermaid 架构图**，展示私有化部署网络拓扑、RAG 数据流向序列图，以及等保三级安全组件清单。

## 📱 2. 交互式原型 (Interactive Prototypes)

无需安装任何环境，直接在浏览器中打开以下 HTML 文件即可体验。

### **A. [客户端 H5 小程序](./insurance-h5-app/preview.html)**
*   **适用对象**：物业管家、一线员工
*   **核心功能**：
    *   🛡️ **一键报案**：可视化的理赔进度条 (Stepper)。
    *   🤖 **AI 智能咨询**：基于 RAG 的智能问答界面。
    *   💰 **预付赔款**：大额赔案的预付流程展示。
    *   🎨 **设计风格**：高端商务蓝金配色，移动端优先体验。

### **B. [管理端 Admin 后台](./insurance-h5-app/admin_dashboard.html)**
*   **适用对象**：物业管理层、IT 安全部门、合规审计员
*   **核心功能**：
    *   📊 **数据驾驶舱**：理赔案件量、预付金额趋势的可视化图表 (Recharts)。
    *   🔒 **安全审计日志**：实时监控敏感数据访问，展示 IP 和合规等级。
    *   📈 **风险分布**：各区域公司的高频风险类型统计。

## 🚀 如何开始 (How to Start)

1.  **查看原型**：在文件管理器中找到 `insurance-h5-app` 文件夹，双击打开 `.html` 文件。
2.  **阅读架构**：使用支持 Markdown 预览的编辑器（如 VS Code）查看 `docs/ARCHITECTURE.md` 以获取最佳阅读体验（查看架构图）。
3.  **开发环境**：
    *   项目基于 React + Vite 结构生成。
    *   若需继续开发，请安装 Node.js 环境，并在终端运行 `npm install` 和 `npm run dev`。

---
*Created by Antigravity Agent for User Tony Yu*
