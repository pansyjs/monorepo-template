import 'zx/globals'
import path from 'node:path';
import fs from 'fs-extra';
import simpleGit from 'simple-git';
import dayjs from 'dayjs';
import { createLogger } from './utils/signale';
import { generateRandomString } from './utils/string';

const git = simpleGit();
const cwd = process.cwd();
const logger = createLogger('publish:beta');

function getNextVersion(currentVersion: string) {
  const random = generateRandomString();

  return `${currentVersion.split('-')[0]}-canary.${random}.${dayjs().format('YYYYMMDD')}`;
}

(async () => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const branch = await git.branch();
  const current = await fs.readJSON(packageJsonPath);

  const version = getNextVersion(current.version)
  current.version = version;

  logger.info(`修改 ${current.name} 版本为 ${version}`);

  await fs.writeJSON(packageJsonPath, current, { spaces: 2 });
})();
