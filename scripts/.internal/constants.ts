import { join } from 'node:path'
import { __dirname } from '../utils/url'

const ROOT = join(__dirname, '../../')

export const PATHS = {
  ROOT,
  PACKAGES: join(ROOT, 'packages'),
} as const

/** 发布正式版本的主分支 */
export const MASTER_BRANCH = 'main';
