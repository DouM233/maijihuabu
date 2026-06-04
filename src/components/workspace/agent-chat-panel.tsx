'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage } from '@/lib/types';

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export function AgentChatPanel() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMessages = useAppStore((s) => s.chatMessages);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const clearChat = useAppStore((s) => s.clearChat);
  const setAppliedPrompt = useAppStore((s) => s.setAppliedPrompt);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addChatMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    });

    // TODO: 后续对接 LLM Agent 流式接口，当前为占位响应
    setTimeout(() => {
      addChatMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `[Agent 占位回复] 已收到您的需求："${trimmed}"。\n\n后续将对接 LLM 流式接口，自动将您的自然语言描述外扩为包含光影、环境、相机参数的结构化 Prompt。`,
        timestamp: Date.now(),
      });
    }, 500);

    setInput('');
  }, [input, addChatMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="flex h-full flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">智能助理</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={clearChat}
          title="清空对话"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 消息区 */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        {chatMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            输入描述，如“放海滩上，高端点”，Agent 将为您优化提示词
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {chatMessages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* 输入区 */}
      <div className="border-t px-4 py-2">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述您想要的效果…"
            className="min-h-[36px] max-h-[80px] resize-none text-xs"
            rows={1}
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="mt-1.5 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px]"
            onClick={() => {
              const lastAssistant = [...chatMessages]
                .reverse()
                .find((m) => m.role === 'assistant');
              if (lastAssistant) {
                setAppliedPrompt(lastAssistant.content);
              }
            }}
            disabled={!chatMessages.some((m) => m.role === 'assistant')}
          >
            应用最新提示词
          </Button>
        </div>
      </div>
    </div>
  );
}
