import 'zx/globals'
import path from 'node:path';
import fs from 'fs-extra';
import simpleGit from 'simple-git';
import dayjs from 'dayjs';
import { createLogger } from './utils/signale';
import { generateRandomString } from './utils/string';
import { MASTER_BRANCH } from './.internal/constants';

const git = simpleGit();
const cwd = process.cwd();
const logger = createLogger('publish:beta');

function getNextVersion(branch: string) {
  const branchName = branch.replace(/\//g, '-');
  const random = generateRandomString();

  return `${branchName}-${random}-${dayjs().format('YYYYMMDD')}`;
}

(async () => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const branch = await git.branch();
  const current = await fs.readJSON(packageJsonPath);

  if (branch.current === MASTER_BRANCH) {
    logger.error('不能在主分支发布');
    process.exit(1);
  }

  const version = getNextVersion(branch.current)
  current.version = version;

  logger.info(`修改 ${current.name} 版本为 ${version}`);

  await fs.writeJSON(packageJsonPath, current, { spaces: 2 });

  logger.info(`发布 ${current.name}`);

  await $`pnpm publish`
})();
