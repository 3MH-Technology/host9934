'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startBot, stopBot, deleteBot } from '@/app/actions/bot';
import { Play, Square, Trash2 } from 'lucide-react';

export default function BotControls({ botId, status }: { botId: string, status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    await startBot(botId);
    setLoading(false);
    router.refresh();
  }

  async function handleStop() {
    setLoading(true);
    await stopBot(botId);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا البوت؟')) return;
    setLoading(true);
    await deleteBot(botId);
    router.push('/dashboard/bots');
  }

  return (
    <div className="flex items-center gap-2">
      {status !== 'RUNNING' && status !== 'BUILDING' && (
        <button 
          onClick={handleStart} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          <Play size={16} />
          <span>تشغيل</span>
        </button>
      )}
      {(status === 'RUNNING' || status === 'BUILDING') && (
        <button 
          onClick={handleStop} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50"
        >
          <Square size={16} />
          <span>إيقاف</span>
        </button>
      )}
      <button 
        onClick={handleDelete} 
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 disabled:opacity-50"
      >
        <Trash2 size={16} />
        <span>حذف</span>
      </button>
    </div>
  );
}
