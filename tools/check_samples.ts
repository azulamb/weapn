/** Checks the sample configs against published JSR packages outside the development workspace. */
import { dirname, fromFileUrl, join } from '@std/path';
const root = dirname(dirname(fromFileUrl(import.meta.url)));
const temporary = await Deno.makeTempDir({ prefix: 'weapn-samples-' });
async function copySources(from: string, to: string): Promise<void> {
  await Deno.mkdir(to, { recursive: true });
  for await (const entry of Deno.readDir(from)) {
    if (
      entry.name.startsWith('.') || entry.name === 'dist' ||
      /\.(exe|dll|ico)$/.test(entry.name)
    ) continue;
    if (entry.isDirectory) {
      await copySources(join(from, entry.name), join(to, entry.name));
    } else if (entry.isFile) {
      await Deno.copyFile(join(from, entry.name), join(to, entry.name));
    }
  }
}
try {
  for (const sample of ['sample', 'sample2', 'sample3']) {
    const directory = join(temporary, sample);
    await copySources(join(root, sample), directory);
    const entries = ['main.ts'];
    try {
      await Deno.stat(join(directory, 'build.ts'));
      entries.push('build.ts');
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
    const result = await new Deno.Command(Deno.execPath(), {
      args: ['check', '--no-lock', ...entries],
      cwd: directory,
      stdout: 'inherit',
      stderr: 'inherit',
    }).output();
    if (!result.success) {
      throw new Error(
        `Published dependencies failed for ${sample}. Publish matching library versions first; the local workspace must not mask this failure.`,
      );
    }
  }
} finally {
  await Deno.remove(temporary, { recursive: true });
}
