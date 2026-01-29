import React, { useState, useRef, useEffect } from 'react';
import { createChatStream, generatePolicyImage } from '../services/geminiService';
import { ImageSize, ChatMessage } from '../types';
import { 
    Send, 
    Bot, 
    User as UserIcon, 
    Image as ImageIcon, 
    Download, 
    Loader2, 
    AlertCircle,
    Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- CHAT COMPONENT ---

export const ChatComponent: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init',
            role: 'model',
            text: '你好，我是您的政策智能助手。我可以帮您查询内部政策库、总结工信部法规，或解释复杂的数据治理规则。今天有什么可以帮您？',
            timestamp: Date.now()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for Gemini
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // Create placeholder for stream
            const responseId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: responseId,
                role: 'model',
                text: '', // Start empty
                timestamp: Date.now()
            }]);

            const streamResult = await createChatStream(userMsg.text, history);

            let fullText = '';
            for await (const chunk of streamResult) {
                const chunkText = chunk.text || ''; 
                fullText += chunkText;
                
                setMessages(prev => prev.map(m => 
                    m.id === responseId ? { ...m, text: fullText } : m
                ));
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "抱歉，连接政策数据库时出现错误。",
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                ${msg.role === 'user' ? 'bg-slate-200 ml-3' : 'bg-indigo-600 mr-3'}
                            `}>
                                {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>
                            <div className={`
                                p-4 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user' 
                                    ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                                    : 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'}
                            `}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                         <div className="flex items-center space-x-2 ml-12 text-slate-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>正在分析政策语料库...</span>
                         </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="询问关于法规、数据统计或政策摘要..."
                        className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                     <span className="text-xs text-slate-400">Powered by Gemini 1.5 Pro Preview</span>
                </div>
            </div>
        </div>
    );
};

// --- IMAGE GENERATION COMPONENT ---

export const ImageGenComponent: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [size, setSize] = useState<ImageSize>(ImageSize.Resolution_1K);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        setImage(null);

        try {
            const result = await generatePolicyImage(prompt, size);
            if (result) {
                setImage(result);
            } else {
                setError("未生成图片，请尝试不同的提示词。");
            }
        } catch (err: any) {
            setError(err.message || "图片生成失败。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                        视觉工坊
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        使用 Gemini 3 为您的政策报告生成高保真可视化图表、信息图或封面图。
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">提示词 (Prompt)</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                placeholder="例如：一个代表工业互联网增长的未来数字城市，带有蓝色和金色的节点..."
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">分辨率</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(ImageSize).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`py-2 px-3 text-sm rounded-lg border font-medium transition-colors ${
                                            size === s 
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    渲染中...
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    生成视觉图
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                        <p className="text-xs text-blue-800">
                            <strong>注意：</strong> 更高分辨率 (4K) 可能需要更长时间生成。请确保提示词描述详细以获得最佳效果。
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2">
                <div className={`
                    bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 min-h-[500px] flex items-center justify-center relative overflow-hidden
                    ${!image && !loading ? 'bg-slate-50' : 'bg-black'}
                `}>
                    {loading && (
                        <div className="text-center z-10">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                            <p className="text-slate-500 font-medium animate-pulse">正在创作...</p>
                        </div>
                    )}

                    {!loading && !image && !error && (
                        <div className="text-center text-slate-400 max-w-sm px-4">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium text-slate-500">暂无生成图片</p>
                            <p className="text-sm mt-2">输入提示词并点击生成以见证 AI 魔法。</p>
                        </div>
                    )}

                    {!loading && error && (
                         <div className="text-center text-red-500 max-w-sm px-4">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {image && (
                        <>
                            <img src={image} alt="Generated Policy Visual" className="w-full h-full object-contain" />
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <a 
                                    href={image} 
                                    download={`policy-visual-${Date.now()}.png`}
                                    className="p-3 bg-white/90 backdrop-blur rounded-full text-slate-800 hover:text-indigo-600 shadow-lg hover:scale-105 transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};