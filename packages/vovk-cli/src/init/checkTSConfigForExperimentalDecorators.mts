import type { TsConfigJson } from 'type-fest';
import path from 'path';
import fs from 'fs/promises';
import * as jsonc from 'jsonc-parser';

export default async function checkTSConfigForExperimentalDecorators(root: string) {
  const tsconfigPath = path.resolve(root, 'tsconfig.json');
  let tsconfigContent: string;
  try {
    tsconfigContent = await fs.readFile(tsconfigPath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to read tsconfig.json at ${tsconfigPath}. You can run "npx tsc --init" to create it. ${String(error)}`
    );
  }

  const tsconfig = jsonc.parse(tsconfigContent) as TsConfigJson;

  return !!tsconfig?.compilerOptions?.experimentalDecorators;
}