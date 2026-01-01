import React, { useState, useEffect, useRef } from 'react';
import {
    Shield,
    Siren,
    FileText,
    MessageSquare,
    ChevronRight,
    Camera,
    AlertCircle
} from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('claim');
    const [showUpload, setShowUpload] = useState(false);
    const [uploadState, setUploadState] = useState('idle'); // idle, scanning, result

    // Chat State
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [ragStep, setRagStep] = useState(0);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isThinking, ragStep]);

    const handleScanSim = () => {
        setUploadState('scanning');
        // Simulate AI processing delay
        setTimeout(() => {
            setUploadState('result');
        }, 2000);
    };

    const resetUpload = () => {
        setShowUpload(false);
        setUploadState('idle');
    };

    const handleSend = () => {
        if (!inputMsg.trim()) return;

        const userMsg = { role: 'user', content: inputMsg };
        setChatHistory(prev => [...prev, userMsg]);
        setInputMsg('');
        setIsThinking(true);
        setRagStep(0);

        // Simulate RAG Process
        // Step 1: Retrieval
        setTimeout(() => setRagStep(1), 1000);
        setTimeout(() => setRagStep(2), 2000);

        // Step 2: Generation (Typewriter effect simulation)
        setTimeout(() => {
            setIsThinking(false);
            const aiContent = "根据条款规定，如果是由于电梯维保不当导致的故障（属于特种设备责任），且造成了人员受伤或财产损失，通常在【公众责任险】的赔偿范围内。但您需要提供特种设备年检合格证。";
            const citations = ["公众责任险-责任免除条款 第2.3条", "特种设备安全法 第38条"];

            setChatHistory(prev => [...prev, { role: 'ai', content: aiContent, citations }]);
        }, 3500);
    };

    return (
        <div className="container">
            {/* Header */}
            <header className="animate-entry" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ marginBottom: '4px' }}>XX物业全国统保</h3>
                    <h1 style={{ marginBottom: 0 }}>保险AI服务</h1>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Shield size={20} />
                </div>
            </header>

            {/* Main Action Grid */}
            <div className="animate-entry delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="card card-glass" onClick={() => setActiveTab('claim')} style={{
                    borderColor: activeTab === 'claim' ? 'var(--primary)' : 'transparent',
                    backgroundColor: activeTab === 'claim' ? '#fff' : 'rgba(255,255,255,0.6)'
                }}>
                    <div style={{ padding: '12px', background: 'var(--bg-body)', borderRadius: '12px', width: 'fit-content', marginBottom: '12px' }}>
                        <Siren size={24} color="var(--primary)" />
                    </div>
                    <h3>一键报案</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>出险快速响应</p>
                </div>

                <div className="card card-glass" onClick={() => setActiveTab('consult')} style={{
                    borderColor: activeTab === 'consult' ? 'var(--primary)' : 'transparent',
                    backgroundColor: activeTab === 'consult' ? '#fff' : 'rgba(255,255,255,0.6)'
                }}>
                    <div style={{ padding: '12px', background: 'var(--bg-body)', borderRadius: '12px', width: 'fit-content', marginBottom: '12px' }}>
                        <MessageSquare size={24} color="var(--accent)" />
                    </div>
                    <h3>AI 咨询</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>条款与责任界定</p>
                </div>
            </div>

            {/* Tab Content: Claim Progress */}
            {activeTab === 'claim' && (
                <main className="animate-entry delay-2">
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2>当前案件进度</h2>
                            <span style={{ fontSize: '12px', padding: '4px 12px', background: 'hsla(var(--primary-h), 90%, 96%, 1)', color: 'var(--primary)', borderRadius: '20px', fontWeight: '600' }}>
                                案件号 #20240901A
                            </span>
                        </div>

                        {/* Stepper */}
                        <div className="stepper">
                            <div className="step-item completed">
                                <div className="step-circle">✓</div>
                                <div className="step-label">报案</div>
                            </div>
                            <div className="step-item active">
                                <div className="step-circle">2</div>
                                <div className="step-label">查勘定损</div>
                            </div>
                            <div className="step-item">
                                <div className="step-circle">3</div>
                                <div className="step-label">资料审核</div>
                            </div>
                            <div className="step-item">
                                <div className="step-circle">4</div>
                                <div className="step-label">结案</div>
                            </div>
                        </div>

                        {/* Current Action Highlight */}
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                <AlertCircle size={16} color="var(--primary)" />
                                <span style={{ fontWeight: '600', fontSize: '14px' }}>查勘员将在 15 分钟内到达</span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, paddingLeft: '24px' }}>
                                已分配查勘员：李明 (138****0000)<br />
                                距离您 3.5km
                            </p>
                        </div>

                        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                            <Camera size={18} />
                            补充现场照片 / 发票
                        </button>
                    </div>

                    {/* Pre-payment Feature Highlight */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ color: 'white' }}>预付赔款服务</h2>
                                <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>
                                    符合《保险法》第25条规定<br />
                                    审核通过后先行赔付 50%
                                </p>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>
                                ¥ 50,000
                            </div>
                        </div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>状态：待定损确认</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                查看详情 <ChevronRight size={14} />
                            </span>
                        </div>
                    </div>
                </main>
            )}

            {/* Tab Content: AI Consult */}
            {activeTab === 'consult' && (
                <main className="animate-entry delay-2">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', maxHeight: '600px' }}>
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                            {/* AI Welcome Message */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <Shield size={16} />
                                </div>
                                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '0 12px 12px 12px', border: '1px solid #e2e8f0', maxWidth: '85%', fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                                    您好，我是您的专属保险顾问。您可以问我关于公责险、雇主险的任何理赔问题。
                                </div>
                            </div>

                            {/* Chat History */}
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                                    {msg.role === 'ai' && (
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <Shield size={16} />
                                        </div>
                                    )}

                                    <div style={{
                                        background: msg.role === 'user' ? 'var(--primary)' : '#F8FAFC',
                                        color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                                        padding: '12px',
                                        borderRadius: msg.role === 'user' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                                        maxWidth: '85%',
                                        fontSize: '14px',
                                        lineHeight: 1.6,
                                        border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
                                    }}>
                                        {msg.content}
                                        {/* Citation Card for AI */}
                                        {msg.role === 'ai' && msg.citations && (
                                            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FileText size={10} /> 已验证本地条款来源:
                                                </div>
                                                {msg.citations.map((cite, cIdx) => (
                                                    <div key={cIdx} style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px' }}>
                                                        {cite}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* RAG Thinking Indicator */}
                            {isThinking && (
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, color: 'white' }}>
                                        <Shield size={16} />
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className="animate-pulse">🔍 正在检索本地向量数据库...</span>
                                        {ragStep >= 1 && <span className="text-success" style={{ color: 'var(--success)' }}>✅ 命中条款：《公众责任险-责任免除》</span>}
                                        {ragStep >= 2 && <span className="text-success" style={{ color: 'var(--success)' }}>✅ 命中条款：《特种设备安全法》</span>}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                            <input
                                type="text"
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="例如：电梯坏了把人关里面了赔吗？"
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', background: '#f8fafc' }}
                            />
                            <button
                                className="btn btn-primary"
                                style={{ width: 'auto', padding: '0 20px' }}
                                onClick={handleSend}
                                disabled={isThinking || !inputMsg.trim()}
                            >
                                发送
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {/* Bottom Nav */}
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #eee', padding: '12px 24px', display: 'flex', justifyContent: 'space-around', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                    <Shield size={20} />
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>理赔</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <FileText size={20} />
                    <span style={{ fontSize: '10px', fontWeight: '500' }}>保单</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Siren size={20} />
                    <span style={{ fontSize: '10px', fontWeight: '500' }}>风险</span>
                </div>
            </nav>

            {/* Upload Overlay Modal */}
            {showUpload && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card animate-entry" style={{ width: '100%', maxWidth: '400px', margin: 0, position: 'relative', overflow: 'hidden' }}>
                        <button onClick={resetUpload} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '24px', color: '#666' }}>×</button>

                        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>AI 智能识图</h2>

                        <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', position: 'relative', overflow: 'hidden' }} onClick={handleScanSim}>

                            {uploadState === 'idle' && (
                                <>
                                    <Camera size={48} color="#94a3b8" />
                                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '12px' }}>点击拍摄 / 上传文件</p>
                                </>
                            )}

                            {uploadState === 'scanning' && (
                                <>
                                    <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400) center/cover' }}></div>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)', animation: 'scan 1.5s infinite ease-in-out', top: '50%' }}></div>
                                    <style>{`
                                  @keyframes scan {
                                      0% { top: 0%; opacity: 0; }
                                      20% { opacity: 1; }
                                      80% { opacity: 1; }
                                      100% { top: 100%; opacity: 0; }
                                  }
                              `}</style>
                                    <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, textAlign: 'center', color: 'white', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                        AI 正在识别要素...
                                    </div>
                                </>
                            )}

                            {uploadState === 'result' && (
                                <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400) center/cover' }}>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', padding: '16px', borderRadius: '12px 12px 0 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ background: 'var(--success)', padding: '4px', borderRadius: '50%' }}><Shield size={12} color="white" /></div>
                                            <span style={{ fontWeight: '700', color: 'var(--success)' }}>识别成功：医疗发票</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#333' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>发票金额：</span>
                                                <strong>¥ 800.00</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>开票日期：</span>
                                                <span>2024-05-20</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ marginTop: '12px', padding: '10px' }}>确认并提交</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '16px' }}>
                            支持 JPG / PNG / PDF，AI 自动校验合规性
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
