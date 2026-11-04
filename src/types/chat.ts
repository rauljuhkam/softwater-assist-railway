export interface Attachment {
  name: string;
  size: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  model?: string;
  persona?: string;
  attachment?: Attachment;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  model: string;
  persona: string;
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  isDefault?: boolean;
}

export interface AdvancedSettings {
  temperature: number; // 0.0 - 1.0, step 0.1
  topP: number;        // 0.0 - 1.0, step 0.1
}

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  answer: string;
  source: string;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  url: string;
}

export interface KnowledgeBase {
  language: string;
  purpose: string;
  sources: KnowledgeSource[];
  topics: KnowledgeTopic[];
}
