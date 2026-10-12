import { spawnSync } from 'node:child_process';

/**
 * Runs a command in the current directory with its output shown, exits the script if it fails.
 * Args are quoted into one command string: `^` in version ranges is an escape character for cmd.exe.
 */
export const runCommand = (command, args) => {
  const line = [command, ...args.map(arg => `"${arg}"`)].join(' ');
  console.log(line);
  const { status } = spawnSync(line, { stdio: 'inherit', shell: true });
  if (status !== 0) {
    process.exit(status ?? 1);
  }
};
