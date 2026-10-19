// IP не требует DNS-запроса: Android блокирует такие запросы, включая
// "localhost", пока у приложения нет доступа к сети (например, при запуске
// с заблокированным экраном)
export const SITE_HOSTNAME = '127.0.0.1';
// Фиксированный порт сохраняет origin, а с ним и хранилище сайта, между
// запусками
export const SITE_PORT = 3035;
export const SITE_ORIGIN = `http://${SITE_HOSTNAME}:${SITE_PORT}`;
