import { it, describe } from 'node:test';
import path from 'node:path';
import getCLIAssertions from '../lib/getCLIAssertions.mjs';
import assert from 'node:assert';

await describe('CLI new segment', async () => {
  const { runAtProjectDir, createNextApp, vovkInit, assertFile } = getCLIAssertions({
    cwd: path.resolve(import.meta.dirname, '../../..'),
    dir: 'tmp_test_dir',
  });

  await it('New root segment', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment');
    await assertFile(
      'src/app/api/[[...vovk]]/route.ts',
      `initVovk({
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it('New root segment passing "" string as segment name', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment ""');
    await assertFile(
      'src/app/api/[[...vovk]]/route.ts',
      `initVovk({
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it("New root segment passing '' string as segment name", async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir("../dist/index.mjs new segment ''");
    await assertFile(
      'src/app/api/[[...vovk]]/route.ts',
      `initVovk({
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it('New simple segment', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment foo');
    await assertFile(
      'src/app/api/foo/[[...vovk]]/route.ts',
      `initVovk({
        segmentName: 'foo',
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it('New nested segment', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment bar/baz/qwe');
    await assertFile(
      'src/app/api/bar/baz/qwe/[[...vovk]]/route.ts',
      `initVovk({
        segmentName: 'bar/baz/qwe',
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it('Multiple new segments', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment "" foo foo/bar/baz');
    await assertFile(
      'src/app/api/[[...vovk]]/route.ts',
      `initVovk({
          emitSchema: true,
          workers,
          controllers,
        });`
    );
    await assertFile(
      'src/app/api/foo/[[...vovk]]/route.ts',
      `initVovk({
          segmentName: 'foo',
          emitSchema: true,
          workers,
          controllers,
        });`
    );
    await assertFile(
      'src/app/api/foo/bar/baz/[[...vovk]]/route.ts',
      `initVovk({
        segmentName: 'foo/bar/baz',
        emitSchema: true,
        workers,
        controllers,
      });`
    );
  });

  await it('Throws if segment already exists', async () => {
    await createNextApp();
    await vovkInit('--yes');
    await runAtProjectDir('../dist/index.mjs new segment foo');
    await assert.rejects(() => runAtProjectDir('../dist/index.mjs new segment foo'));
  });
});