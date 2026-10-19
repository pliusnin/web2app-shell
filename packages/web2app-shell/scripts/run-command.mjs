import { spawnSync } from 'node:child_process';

/**
 * Запускает команду в текущей папке с выводом в консоль, при ошибке завершает скрипт.
 * Аргументы собираются в одну строку в кавычках: `^` в диапазонах версий —
 * escape-символ для cmd.exe.
 */
export const runCommand = (command, args) => {
  const line = [command, ...args.map(arg => `"${arg}"`)].join(' ');
  console.log(line);
  const { status } = spawnSync(line, { stdio: 'inherit', shell: true });
  if (status !== 0) {
    process.exit(status ?? 1);
  }
};
