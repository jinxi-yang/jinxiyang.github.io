import React, { useState, useEffect } from 'react';
import { DataSourceType, PolicyDocument } from '../types';
import { 
  Globe, 
  Building2, 
  HardDrive, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Database,
  Filter,
  Download,
  Share2,
  BrainCircuit,
  FileText,
  Activity,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- DATA INGESTION VIEW ---

export const DataIngestionView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IngestCard 
          title="网络爬虫" 
          source="通元平台" 
          icon={Globe} 
          description="自动抓取指定政策网站及公共域名的政策文件。"
          color="bg-blue-500"
        />
        <IngestCard 
          title="工信部数据流" 
          source="部委直连" 
          icon={Building2} 
          description="来自工信部的直接安全数据通道。"
          color="bg-red-500"
        />
        <IngestCard 
          title="本地数据" 
          source="项目上传" 
          icon={HardDrive} 
          description="手动上传专项项目文档及内部报告。"
          color="bg-emerald-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">采集活动日志</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">来源</th>
                <th className="px-4 py-3 font-medium">文档批次</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { s: '网络 (通元)', b: 'Batch-2024-X99', st: '同步中', t: '刚刚' },
                { s: '工信部接口', b: 'Policy-Update-V2', st: '已完成', t: '2小时前' },
                { s: '本地数据', b: '内部报告-Q3', st: '已完成', t: '1天前' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{row.s}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{row.b}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.st === '同步中' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {row.st === '同步中' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {row.st}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.t}</td>
                  <td className="px-4 py-3 text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium">查看</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const IngestCard = ({ title, source, icon: Icon, description, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{source}</p>
    <p className="text-slate-600 text-sm mb-6 flex-1">{description}</p>
    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
      配置来源 <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

// --- AGENT PROCESSING VIEW ---

export const ProcessingView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => prev >= 3 ? 1 : prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">智能数据治理</h2>
        <p className="text-slate-500 mt-2">由通元智能体平台及专用算法驱动</p>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between">
          <ProcessStep 
            step={1} 
            current={activeStep} 
            icon={Database} 
            title="原始数据池" 
            desc="多源聚合" 
          />
          <ProcessStep 
            step={2} 
            current={activeStep} 
            icon={BrainCircuit} 
            title="智能体清洗" 
            desc="Dify/通元智能体" 
          />
          <ProcessStep 
            step={3} 
            current={activeStep} 
            icon={CheckCircle2} 
            title="结构化知识库" 
            desc="API 就绪" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-xs overflow-hidden h-64 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-slate-400">agent_log_stream.txt</span>
            </div>
            <div className="mt-6 space-y-2">
                <p>> 正在初始化治理智能体...</p>
                <p className="text-green-400">✓ 智能体 [Policy_Classifier_v2] 已加载。</p>
                <p className="text-green-400">✓ 智能体 [Entity_Extractor_BERT] 已加载。</p>
                <p>> 从网络爬虫获取批次 #2938...</p>
                <p>> 正在处理文档 "2025年数字转型指南.pdf"</p>
                <p className="text-yellow-400">! 检测到头部噪点，正在清洗...</p>
                <p>> 提取关键实体: [5G], [工业互联网], [补贴]</p>
                <p>> 正在标准化日期格式...</p>
                {activeStep === 2 && <p className="animate-pulse text-blue-400">> 正在应用 Dify 工作流规则...</p>}
                {activeStep === 3 && <p className="text-green-400">✓ 批次已成功提交至知识图谱。</p>}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <BrainCircuit className="w-10 h-10 text-indigo-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">算法市场</h3>
             <p className="text-slate-500 my-4 text-sm px-8">
                 从智能体平台选择预置的治理算法应用于特定数据流。
             </p>
             <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                 管理算法
             </button>
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ step, current, icon: Icon, title, desc }: any) => {
    const isActive = step === current;
    const isPast = step < current;
    
    return (
        <div className="flex flex-col items-center bg-slate-50 p-2 rounded-xl">
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500
                ${isActive ? 'bg-indigo-600 border-indigo-200 text-white scale-110 shadow-lg' : 
                  isPast ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-slate-200 text-slate-400'}
            `}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="mt-4 text-center">
                <h4 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{title}</h4>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </div>
    );
};

// --- DASHBOARD VIEW ---

export const DashboardView: React.FC = () => {
    const data = [
      { name: '周一', docs: 400 },
      { name: '周二', docs: 300 },
      { name: '周三', docs: 550 },
      { name: '周四', docs: 450 },
      { name: '周五', docs: 600 },
      { name: '周六', docs: 200 },
      { name: '周日', docs: 150 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: '政策总数', val: '14,203', icon: FileText, c: 'text-blue-600' },
                    { label: '今日处理', val: '128', icon: Activity, c: 'text-green-600' },
                    { label: '待审核', val: '42', icon: Loader2, c: 'text-orange-600' },
                    { label: 'API 请求', val: '8.4k', icon: Globe, c: 'text-purple-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                        <div className={`p-3 rounded-lg bg-opacity-10 ${stat.c.replace('text', 'bg')} mr-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.c}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">处理量 (周趋势)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="docs" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">来源分布</h3>
                    <div className="space-y-4">
                        {[
                            { label: '网络爬虫', val: 65, color: 'bg-blue-500' },
                            { label: '工信部直连', val: 25, color: 'bg-red-500' },
                            { label: '本地项目', val: 10, color: 'bg-emerald-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{item.label}</span>
                                    <span className="text-slate-500">{item.val}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-sm text-slate-800 mb-2">系统状态</h4>
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>智能体平台已连接</span>
                        </div>
                         <div className="flex items-center space-x-2 text-sm text-green-600 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>API 网关运行中</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SEARCH VIEW ---

export const SearchView: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="搜索政策、法规或关键词..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter className="w-4 h-4 mr-2" />
                        筛选
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                        搜索
                    </button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group p-4 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">新能源</span>
                                        <span className="text-xs text-slate-400">发布于: 2天前</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        工业数字化转型实施方案 (2024-2026)
                                    </h4>
                                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                        本文件概述了加速制造业数字化转型的战略举措，重点关注5G融合及工业互联网平台建设...
                                    </p>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ApiDocsView: React.FC = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">开发者 API</h2>
            <button className="flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                <Download className="w-5 h-5 mr-2" />
                下载 SDK
            </button>
        </div>
        
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">服务端点: 政策检索</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                    <div className="flex items-center mb-2">
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded font-bold mr-2">GET</span>
                        <span className="text-white">/api/v1/policies/search</span>
                    </div>
                    <p className="text-slate-500">
                        {`curl -X GET "https://api.policyintel.cn/v1/policies/search?q=5G&limit=10" \\`} <br/>
                        {`     -H "Authorization: Bearer YOUR_API_KEY"`}
                    </p>
                </div>
            </div>

             <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">服务端点: 治理统计</h3>
                 <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                    <div className="flex items-center mb-2">
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded font-bold mr-2">GET</span>
                        <span className="text-white">/api/v1/stats/processing</span>
                    </div>
                    <p className="text-slate-500">
                        {`curl -X GET "https://api.policyintel.cn/v1/stats/processing" \\`} <br/>
                        {`     -H "Authorization: Bearer YOUR_API_KEY"`}
                    </p>
                </div>
            </div>
        </div>
    </div>
);