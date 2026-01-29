export enum View {
  DASHBOARD = 'DASHBOARD',
  INGESTION = 'INGESTION',
  PROCESSING = 'PROCESSING',
  SEARCH = 'SEARCH',
  CHAT = 'CHAT',
  IMAGE_GEN = 'IMAGE_GEN',
  API_DOCS = 'API_DOCS'
}

export enum DataSourceType {
  WEB = '网络爬虫 (通元)',
  MIIT = '工信部数据流',
  LOCAL = '本地项目数据'
}

export interface PolicyDocument {
  id: string;
  title: string;
  source: DataSourceType;
  date: string;
  status: 'Raw' | 'Processing' | 'Cleaned' | 'Published';
  summary?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ImageSize {
  Resolution_1K = '1K',
  Resolution_2K = '2K',
  Resolution_4K = '4K'
}