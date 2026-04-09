import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import CreateBotForm from './CreateBotForm';

export default async function BotsPage() {
  const session = await getSession();
  if (!session) return null;

  const bots = await prisma.bot.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">البوتات</h1>
          <p className="text-muted-foreground mt-1">إدارة البوتات الخاصة بك.</p>
        </div>
        <CreateBotForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots.map(bot => (
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
        {bots.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl text-muted-foreground">
            لا يوجد لديك أي بوتات حالياً. انقر على "إنشاء بوت جديد" للبدء.
          </div>
        )}
      </div>
    </div>
  );
}
