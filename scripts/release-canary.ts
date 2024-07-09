import 'zx/globals'
import simpleGit from 'simple-git';
import { createLogger } from './utils/signale';
import { getPath } from './utils/getPath';
import { MASTER_BRANCH } from './.internal/constants';

const git = simpleGit();
const logger = createLogger('release:canary');

(async () => {
  const branch = await git.branch();

  logger.info(`当前分支: ${branch.current}`);

  if (branch.current === MASTER_BRANCH) {
    logger.error('不能在主分支发布');
    process.exit(1);
  }

  const pull = await git.pull();
  if (pull?.summary?.changes) {
    logger.info('远程存在未拉取的提交');
  }

  logger.info(`修改变更包的版本`);

  await $`nx run-many --target=canary:version`;

  await $`pnpm i`;
  await git.add([
    getPath('packages'),
    getPath('package.json'),
    getPath('pnpm-lock.yaml')
  ]);
  await git.commit(`chore(release): canary`)

  logger.info(`发布所有变更包`);

  await $`nx run-many --target=publish --tag canary`;
})();
