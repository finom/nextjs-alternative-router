import path from 'path';
import fs from 'fs/promises';
import type { VovkSchema } from 'vovk';
import diffSchema, { DiffResult } from './diffSchema.mjs';

export const ROOT_SEGMENT_SCHEMA_NAME = '_root';

export default async function writeOneSchemaFile({
  schemaOutFullPath,
  schema,
  skipIfExists = false,
}: {
  schemaOutFullPath: string;
  schema: VovkSchema;
  skipIfExists?: boolean;
}): Promise<{
  isCreated: boolean;
  diffResult: DiffResult | null;
}> {
  const segmentPath = path.join(schemaOutFullPath, `${schema.segmentName || ROOT_SEGMENT_SCHEMA_NAME}.json`);

  if (skipIfExists) {
    try {
      await fs.stat(segmentPath);
      return { isCreated: false, diffResult: null };
    } catch {
      // File doesn't exist
    }
  }

  await fs.mkdir(path.dirname(segmentPath), { recursive: true });
  const schemaStr = JSON.stringify(schema, null, 2);
  const existing = await fs.readFile(segmentPath, 'utf-8').catch(() => null);
  if (existing === schemaStr) {
    return { isCreated: false, diffResult: null };
  }
  await fs.writeFile(segmentPath, schemaStr);

  if (existing) {
    return { isCreated: false, diffResult: diffSchema(JSON.parse(existing) as VovkSchema, schema) };
  }

  return { isCreated: true, diffResult: null };
}