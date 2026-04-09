'use client';

import { useState } from 'react';
import { getFile, saveFile } from '@/app/actions/bot';
import { File, Save, RefreshCw } from 'lucide-react';

export default function FileEditor({ botId, initialFiles }: { botId: string, initialFiles: string[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  async function handleSelectFile(filename: string) {
    setLoading(true);
    setSelectedFile(filename);
    const res = await getFile(botId, filename);
    if (res.content !== undefined) {
      setContent(res.content);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!selectedFile) return;
    setSaving(true);
    await saveFile(botId, selectedFile, content);
    setSaving(false);
  }

  async function handleCreateFile(e: React.FormEvent) {
    e.preventDefault();
    if (!newFileName) return;
    
    // Create empty file
    await saveFile(botId, newFileName, '');
    if (!files.includes(newFileName)) {
      setFiles([...files, newFileName]);
    }
    setNewFileName('');
    handleSelectFile(newFileName);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[600px]">
      <div className="w-full md:w-64 flex flex-col gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex-1 overflow-y-auto">
          <h3 className="font-bold mb-4 text-sm text-muted-foreground">الملفات</h3>
          <div className="space-y-1">
            {files.map(f => (
              <button
                key={f}
                onClick={() => handleSelectFile(f)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${selectedFile === f ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                <File size={14} />
                <span className="truncate" dir="ltr">{f}</span>
              </button>
            ))}
            {files.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">لا توجد ملفات</p>
            )}
          </div>
        </div>
        
        <form onSubmit={handleCreateFile} className="flex gap-2">
          <input
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            placeholder="اسم الملف..."
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            dir="ltr"
          />
          <button type="submit" className="px-3 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 text-sm">
            إضافة
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col bg-card border border-border rounded-lg overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-sm font-mono" dir="ltr">{selectedFile}</span>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                حفظ
              </button>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
              className="flex-1 w-full p-4 bg-[#0d1117] text-gray-300 font-mono text-sm resize-none focus:outline-none"
              dir="ltr"
              spellCheck={false}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            اختر ملفاً للتعديل
          </div>
        )}
      </div>
    </div>
  );
}
