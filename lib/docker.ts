import Docker from 'dockerode';
import path from 'path';
import fs from 'fs';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const BOTS_DATA_DIR = process.env.BOTS_DATA_DIR || path.join(process.cwd(), 'bots_data');

// Ensure the bots data directory exists
if (!fs.existsSync(BOTS_DATA_DIR)) {
  fs.mkdirSync(BOTS_DATA_DIR, { recursive: true });
}

export function getBotDir(botId: string) {
  const dir = path.join(BOTS_DATA_DIR, botId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function startBotContainer(botId: string, language: 'PYTHON' | 'PHP', envVars: Record<string, string>) {
  const botDir = getBotDir(botId);
  
  // Determine image and command based on language
  let image = '';
  let cmd: string[] = [];
  
  if (language === 'PYTHON') {
    image = 'python:3.11-slim';
    cmd = ['sh', '-c', 'if [ -f requirements.txt ]; then pip install -r requirements.txt; fi && python main.py'];
  } else if (language === 'PHP') {
    image = 'php:8.2-cli';
    cmd = ['sh', '-c', 'if [ -f composer.json ]; then apt-get update && apt-get install -y unzip && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && composer install; fi && php main.php'];
  }

  // Pull image if not exists
  try {
    await docker.pull(image);
  } catch (e) {
    console.error('Error pulling image', e);
  }

  const envArray = Object.entries(envVars).map(([k, v]) => `${k}=${v}`);

  const container = await docker.createContainer({
    Image: image,
    Cmd: cmd,
    Env: envArray,
    HostConfig: {
      Binds: [`${botDir}:/app`],
      Memory: 256 * 1024 * 1024, // 256MB limit
      CpuQuota: 50000, // 50% of CPU
      NetworkMode: 'bridge',
      SecurityOpt: ['no-new-privileges:true'],
      ReadonlyRootfs: false, // Need to install deps
      CapDrop: ['ALL'], // Drop all capabilities
    },
    WorkingDir: '/app',
    User: '1000:1000', // Run as non-root user
    Labels: {
      botId: botId,
    },
  });

  await container.start();
  return container.id;
}

export async function stopBotContainer(containerId: string) {
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    await container.remove();
  } catch (error) {
    console.error('Error stopping container', error);
  }
}

export async function getContainerLogs(containerId: string) {
  try {
    const container = docker.getContainer(containerId);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
      timestamps: true,
    });
    return logs.toString('utf-8');
  } catch (error) {
    console.error('Error getting logs', error);
    return 'Error fetching logs or container not found.';
  }
}

export async function getContainerStatus(containerId: string) {
  try {
    const container = docker.getContainer(containerId);
    const data = await container.inspect();
    return data.State.Status; // 'running', 'exited', etc.
  } catch (error) {
    return 'not_found';
  }
}
