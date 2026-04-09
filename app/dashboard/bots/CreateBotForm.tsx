'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBot } from '@/app/actions/bot';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';

export default function CreateBotForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await createBot(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      router.push(`/dashboard/bots/${res.bot?.id}`);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          <span>إنشاء بوت جديد</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-card border border-border rounded-xl p-6 z-50 shadow-xl" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">إنشاء بوت جديد</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم البوت</label>
              <input 
                name="name" 
                required 
                placeholder="مثال: My Awesome Bot"
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">لغة البرمجة</label>
              <select 
                name="language" 
                required 
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PYTHON">Python</option>
                <option value="PHP">PHP</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-md hover:bg-muted/80">
                  إلغاء
                </button>
              </Dialog.Close>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
