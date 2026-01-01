import json
import re
import math
from typing import List, Dict

# ==========================================
# 1. 模拟知识库 (Knowledge Base)
# 真实场景中，这些是从保单PDF中OCR识别并切片的数据
# ==========================================
KNOWLEDGE_BASE = [
    {
        "id": "doc_001",
        "section": "公众责任险-第三条",
        "content": "本保险合同所指的第三者，是指除被保险人及其雇员以外的任何人。"
    },
    {
        "id": "doc_002",
        "section": "公众责任险-责任免除",
        "content": "对于因电梯、自动扶梯发生故障造成的第三者人身伤亡，如果被保险人未按国家规定进行定期检验，保险人不承担赔偿责任。"
    },
    {
        "id": "doc_003",
        "section": "雇主责任险-赔偿范围",
        "content": "在工作时间和工作场所内，因工作原因受到事故伤害的，属于工伤保险责任范畴，保险人按照约定负责赔偿。"
    },
    {
        "id": "doc_004",
        "section": "财产一切险-免赔额",
        "content": "每次事故绝对免赔额为人民币2000元或损失金额的10%，两者以高者为准。"
    }
]

# ==========================================
# 2. 简易向量检索算法 (Simulated Vector Search)
# 真实场景会使用 OpenAI Embedding 或 BERT 模型 + Milvus/Faiss
# ==========================================
def get_keywords(text: str) -> set:
    """简单的分词与关键词提取"""
    # 简单的按字/词切分模拟
    return set(re.findall(r"[\u4e00-\u9fa5]{2,}", text))

def jaccard_similarity(query_keywords: set, doc_keywords: set) -> float:
    """计算杰卡德相似度"""
    if not query_keywords or not doc_keywords:
        return 0.0
    intersection = len(query_keywords & doc_keywords)
    union = len(query_keywords | doc_keywords)
    return intersection / union

def retrieve_relevant_docs(query: str, top_k: int = 2) -> List[Dict]:
    """检索最相关的文档切片"""
    query_kws = get_keywords(query)
    print(f"\n🔍 [检索阶段] 用户提问关键词: {query_kws}")
    
    scored_docs = []
    for doc in KNOWLEDGE_BASE:
        doc_kws = get_keywords(doc["content"])
        score = jaccard_similarity(query_kws, doc_kws)
        if score > 0:
            scored_docs.append({**doc, "score": score})
    
    # 按分数降序排列
    scored_docs.sort(key=lambda x: x["score"], reverse=True)
    return scored_docs[:top_k]

# ==========================================
# 3. 模拟 LLM 生成 (Simulated LLM Generation)
# 真实场景会调用文心一言/GPT-4 API
# ==========================================
def generate_answer(query: str, context_docs: List[Dict]) -> str:
    """组装 Prompt 并模拟生成回答"""
    
    # 构造 Prompt
    context_text = "\n".join([f"- [{d['section']}]: {d['content']}" for d in context_docs])
    
    prompt = f"""
【系统指令】
你是一个专业的保险理赔顾问。请基于以下引用的【已知信息】回答用户问题。
如果已知信息无法回答，请直接说“我不知道”。

【已知信息】
{context_text}

【用户问题】
{query}
    """
    
    print("-" * 50)
    print("📝 [构建 Prompt] 实际发送给大模型的内容:")
    print(prompt.strip())
    print("-" * 50)

    # 模拟 LLM 的回答逻辑 (硬编码演示用)
    if not context_docs:
        return "抱歉，知识库中没有找到相关条款，无法回答您的问题。"
    
    if "电梯" in query:
        return (
            "🤖 [AI 回答]: 根据《公众责任险-责任免除》条款，如果电梯故障造成第三者伤亡，"
            "且被保险人未按规定进行定检，保险人是不承担赔偿责任的。建议您提供最新的电梯维保记录和年检合格证。"
        )
    elif "免赔" in query:
        return (
            "🤖 [AI 回答]: 根据《财产一切险-免赔额》规定，每次事故有 2000 元或损失金额 10% 的绝对免赔额，"
            "理赔时会扣除这部分金额（取两者较高者）。"
        )
    else:
        return f"🤖 [AI 回答]: 根据{context_docs[0]['section']}，相关规定为：{context_docs[0]['content']}"

# ==========================================
# 4. 主程序入口
# ==========================================
def main():
    print("🚀 启动 RAG 检索增强生成演示...\n")
    
    # 测试案例 1
    user_query = "电梯出事故了，保险公司赔不赔？"
    print(f"👤 用户提问: {user_query}")
    
    # Step 1: 检索
    relevant_docs = retrieve_relevant_docs(user_query)
    print(f"✅ [检索结果] 找到 {len(relevant_docs)} 条相关知识")
    
    # Step 2: 生成
    answer = generate_answer(user_query, relevant_docs)
    print(answer)
    print("\n" + "="*60 + "\n")

    # 测试案例 2
    user_query = "财产险一般要扣多少免赔额？"
    print(f"👤 用户提问: {user_query}")
    
    relevant_docs = retrieve_relevant_docs(user_query)
    print(f"✅ [检索结果] 找到 {len(relevant_docs)} 条相关知识")
    answer = generate_answer(user_query, relevant_docs)
    print(answer)

if __name__ == "__main__":
    main()
