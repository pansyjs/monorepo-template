import 'zx/globals'
import simpleGit from 'simple-git';
import { createLogger } from './utils/signale';

const git = simpleGit();
const logger = createLogger('release');

(async () => {
  const status = await git.status();
  const branch = await git.branch();

  logger.info(`当前分支: ${branch.current}`);

  if (status.files.length !== 0) {
    logger.error('还有未提交的代码');
    process.exit(1);
  }

  const pull = await git.pull();
  if (pull?.summary?.changes) {
    logger.info('远程存在未拉取的提交');
  }

  logger.info(`changeset add`);

  await $`pnpm changeset add`;
})();
