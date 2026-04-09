'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/app/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await register(formData);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">إنشاء حساب</h1>
          <p className="text-sm text-muted-foreground mt-2">انضم إلى استضافة الذئب الآن</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">البريد الإلكتروني</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">كلمة المرور</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              dir="ltr"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟ <Link href="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
