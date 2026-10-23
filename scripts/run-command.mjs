import { spawnSync } from 'node:child_process';

/**
 * Runs a command in the current folder with console output, exits the script on
 * failure. Arguments are joined into one quoted string: `^` in version ranges is
 * an escape character for cmd.exe.
 */
export const runCommand = (command, args) => {
  const line = [command, ...args.map(arg => `"${arg}"`)].join(' ');
  console.log(line);
  const { status } = spawnSync(line, { stdio: 'inherit', shell: true });
  if (status !== 0) {
    process.exit(status ?? 1);
  }
};
