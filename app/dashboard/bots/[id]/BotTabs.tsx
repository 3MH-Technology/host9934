'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { FileCode, Terminal } from 'lucide-react';
import FileEditor from './FileEditor';

export default function BotTabs({ botId, initialLogs, initialFiles }: { botId: string, initialLogs: string, initialFiles: string[] }) {
  return (
    <Tabs.Root defaultValue="files" className="flex flex-col w-full" dir="rtl">
      <Tabs.List className="flex border-b border-border mb-4">
        <Tabs.Trigger value="files" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary outline-none">
          <FileCode size={16} />
          الملفات
        </Tabs.Trigger>
        <Tabs.Trigger value="logs" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary outline-none">
          <Terminal size={16} />
          السجلات
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="files" className="outline-none">
        <FileEditor botId={botId} initialFiles={initialFiles} />
      </Tabs.Content>

      <Tabs.Content value="logs" className="outline-none">
        <div className="bg-[#0d1117] p-4 rounded-lg border border-border overflow-x-auto">
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap min-h-[300px]" dir="ltr">
            {initialLogs || 'لا توجد سجلات حالياً.'}
          </pre>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
