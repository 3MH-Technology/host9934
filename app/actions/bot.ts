'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { startBotContainer, stopBotContainer, getBotDir, getContainerLogs } from '@/lib/docker';
import fs from 'fs';
import path from 'path';

export async function createBot(formData: FormData) {
  const user = await requireAuth();
  const name = formData.get('name') as string;
  const language = formData.get('language') as 'PYTHON' | 'PHP';

  if (!name || !language) {
    return { error: 'Name and language are required' };
  }

  const bot = await prisma.bot.create({
    data: {
      name,
      language,
      userId: user.id,
    },
  });

  // Create directory
  getBotDir(bot.id);

  return { success: true, bot };
}

export async function startBot(botId: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    include: { envVars: true },
  });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const envVars = bot.envVars.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  try {
    await prisma.bot.update({ where: { id: botId }, data: { status: 'BUILDING' } });
    const containerId = await startBotContainer(bot.id, bot.language, envVars);
    await prisma.bot.update({
      where: { id: botId },
      data: { status: 'RUNNING', containerId },
    });
    return { success: true };
  } catch (error: any) {
    await prisma.bot.update({ where: { id: botId }, data: { status: 'ERROR' } });
    return { error: error.message || 'Failed to start bot' };
  }
}

export async function stopBot(botId: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  if (bot.containerId) {
    await stopBotContainer(bot.containerId);
  }

  await prisma.bot.update({
    where: { id: botId },
    data: { status: 'STOPPED', containerId: null },
  });

  return { success: true };
}

export async function getLogs(botId: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  if (!bot.containerId) return { logs: 'Bot is not running.' };

  const logs = await getContainerLogs(bot.containerId);
  return { logs };
}

export async function saveFile(botId: string, filename: string, content: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const botDir = getBotDir(botId);
  // Prevent path traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(botDir, safeFilename);

  fs.writeFileSync(filePath, content);
  return { success: true };
}

export async function listFiles(botId: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const botDir = getBotDir(botId);
  const files = fs.readdirSync(botDir);
  return { files };
}

export async function getFile(botId: string, filename: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const botDir = getBotDir(botId);
  const safeFilename = path.basename(filename);
  const filePath = path.join(botDir, safeFilename);

  if (!fs.existsSync(filePath)) return { error: 'File not found' };

  const content = fs.readFileSync(filePath, 'utf-8');
  return { content };
}

export async function deleteBot(botId: string) {
  const user = await requireAuth();
  const bot = await prisma.bot.findUnique({ where: { id: botId } });

  if (!bot) return { error: 'Bot not found' };
  if (bot.userId !== user.id && user.role !== 'ADMIN') return { error: 'Unauthorized' };

  if (bot.containerId) {
    await stopBotContainer(bot.containerId);
  }

  const botDir = getBotDir(botId);
  fs.rmSync(botDir, { recursive: true, force: true });

  await prisma.bot.delete({ where: { id: botId } });

  return { success: true };
}
