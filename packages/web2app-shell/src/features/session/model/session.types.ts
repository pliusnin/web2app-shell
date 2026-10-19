// Проверяет сохранённый токен на сервере сайта. При валидном токене
// возвращает ответ: его заголовки Set-Cookie выполняют вход на сайте. При
// невалидном возвращает null, при неудачной проверке (нет сети) бросает ошибку
export type CheckSession = (token: string) => Promise<Response | null>;

export type StoredSession = {
  token: string;
  // Куки, которые приложение поставило для сессии; удаляются при её завершении
  cookieNames: Array<string>;
};
