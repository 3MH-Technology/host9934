import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import BotControls from './BotControls';
import BotTabs from './BotTabs';
import { getContainerLogs } from '@/lib/docker';
import fs from 'fs';
import path from 'path';
import { getBotDir } from '@/lib/docker';

export default async function BotDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;

  const bot = await prisma.bot.findUnique({
    where: { id },
    include: { envVars: true },
  });

  if (!bot) notFound();
  if (bot.userId !== session.id && session.role !== 'ADMIN') notFound();

  let logs = 'No logs available.';
  if (bot.containerId) {
    logs = await getContainerLogs(bot.containerId);
  }

  const botDir = getBotDir(bot.id);
  const files = fs.readdirSync(botDir).filter(f => !fs.statSync(path.join(botDir, f)).isDirectory());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bot.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-muted-foreground">اللغة: {bot.language}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              bot.status === 'RUNNING' ? 'bg-green-500/10 text-green-500' :
              bot.status === 'ERROR' ? 'bg-red-500/10 text-red-500' :
              bot.status === 'BUILDING' ? 'bg-blue-500/10 text-blue-500' :
              'bg-zinc-500/10 text-zinc-500'
            }`}>
              {bot.status}
            </span>
          </div>
        </div>
        <BotControls botId={bot.id} status={bot.status} />
      </div>

      <BotTabs botId={bot.id} initialLogs={logs} initialFiles={files} />
    </div>
  );
}
