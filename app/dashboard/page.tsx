import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Server, Play, Square, AlertCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const bots = await prisma.bot.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  const runningBots = bots.filter(b => b.status === 'RUNNING').length;
  const stoppedBots = bots.filter(b => b.status === 'STOPPED').length;
  const errorBots = bots.filter(b => b.status === 'ERROR').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">نظرة عامة</h1>
        <p className="text-muted-foreground mt-1">مرحباً بك في لوحة تحكم استضافة الذئب.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">إجمالي البوتات</p>
            <p className="text-2xl font-bold">{bots.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-500/10 text-green-500">
            <Play size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">تعمل الآن</p>
            <p className="text-2xl font-bold">{runningBots}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-zinc-500/10 text-zinc-500">
            <Square size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">متوقفة</p>
            <p className="text-2xl font-bold">{stoppedBots}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">أخطاء</p>
            <p className="text-2xl font-bold">{errorBots}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">أحدث البوتات</h2>
          <Link href="/dashboard/bots" className="text-sm text-primary hover:underline">
            عرض الكل
          </Link>
        </div>
        
        {bots.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl text-muted-foreground">
            لا يوجد لديك أي بوتات حالياً.
            <div className="mt-4">
              <Link href="/dashboard/bots" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                إنشاء بوت جديد
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.slice(0, 3).map(bot => (
              <Link key={bot.id} href={`/dashboard/bots/${bot.id}`} className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold truncate">{bot.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bot.status === 'RUNNING' ? 'bg-green-500/10 text-green-500' :
                    bot.status === 'ERROR' ? 'bg-red-500/10 text-red-500' :
                    bot.status === 'BUILDING' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {bot.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  اللغة: {bot.language}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
