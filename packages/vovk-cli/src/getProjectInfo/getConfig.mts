import readConfig from './readConfig.mjs';
import type { VovkConfig, VovkEnv } from '../types.mjs';
import getCwdPath from './getCwdPath.mjs';
import getSrcRoot from './getSrcRoot.mjs';
import path from 'path';

export default async function getConfig({ clientOutDir }: { clientOutDir?: string }) {
  const env = process.env as VovkEnv;
  const userConfig = await readConfig();
  const srcRoot = await getSrcRoot();
  const cwd = process.cwd();
  const config: Required<VovkConfig> = {
    modulesDir: path.join(
      cwd,
      env.VOVK_MODULES_DIR ?? userConfig.modulesDir ?? './' + [srcRoot, 'modules'].filter(Boolean).join('/')
    ),
    validateOnClient: getCwdPath(env.VOVK_VALIDATE_ON_CLIENT ?? userConfig.validateOnClient ?? null),
    validationLibrary: getCwdPath(env.VOVK_VALIDATION_LIBRARY ?? userConfig.validationLibrary ?? null),
    fetcher: getCwdPath(env.VOVK_FETCHER ?? userConfig.fetcher ?? 'vovk/client/defaultFetcher'),
    metadataOutDir: env.VOVK_METADATA_OUT_DIR ?? userConfig.metadataOutDir ?? './.vovk-schema',
    clientOutDir: clientOutDir ?? env.VOVK_CLIENT_OUT_DIR ?? userConfig.clientOutDir ?? './node_modules/.vovk',
    origin: (env.VOVK_ORIGIN ?? userConfig.origin ?? '').replace(/\/$/, ''), // Remove trailing slash
    rootEntry: env.VOVK_ROOT_ENTRY ?? userConfig.rootEntry ?? 'api',
    rootSegmentModulesDirName: env.VOVK_ROOT_SEGMENT_MODULES_DIR_NAME ?? userConfig.rootSegmentModulesDirName ?? '',
    logLevel: env.VOVK_LOG_LEVEL ?? userConfig.logLevel ?? 'debug', // TODO: change to 'warn' when v3 is ready
  };

  return { config, srcRoot };
}