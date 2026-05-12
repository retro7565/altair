# Altair — Дорожная карта проекта

```mermaid
gantt
    title Altair — График разработки
    dateFormat  YYYY-MM-DD
    axisFormat  %d.%m

    section 🛠 Подготовка
    Установка ПО и аккаунты         :done,    m0a, 2026-05-12, 1d
    Figma — прототип экранов        :done,    m0b, 2026-05-12, 1d

    section ⚙️ Milestone 1 — Фундамент
    Vite + React + Tailwind         :active,  m1a, 2026-05-13, 1d
    Структура папок                 :         m1b, after m1a, 1d
    Layout — шапка, навигация       :         m1c, after m1b, 1d
    Первый деплой на Vercel         :         m1d, after m1c, 1d

    section 🗄 Milestone 2 — База данных
    Таблицы в Supabase              :         m2a, after m1d, 1d
    RLS-политики                    :         m2b, after m2a, 1d
    Seed-данные (TOP 10 моделей)    :         m2c, after m2b, 1d

    section 🤖 Milestone 3 — Каталог AI
    Страница /catalog               :         m3a, after m2c, 1d
    Карточки + фильтры + поиск      :         m3b, after m3a, 1d
    Страница /catalog/:id           :         m3c, after m3b, 2d

    section 🔐 Milestone 4 — Авторизация
    Login / Register страницы       :         m4a, after m3c, 1d
    Supabase Auth + useAuth hook    :         m4b, after m4a, 1d
    Защищённые роуты                :         m4c, after m4b, 1d

    section 📝 Milestone 5 — Промпты
    Страница /prompts               :         m5a, after m4c, 1d
    Создание / редактирование       :         m5b, after m5a, 1d
    Страница /prompts/:id           :         m5c, after m5b, 1d
    Комментарии и лайки             :         m5d, after m5c, 1d

    section 👤 Milestone 6 — Профиль
    Страница /profile               :         m6a, after m5d, 1d
    Аватар (Supabase Storage)       :         m6b, after m6a, 1d
    Список своих промптов           :         m6c, after m6b, 1d

    section 🏠 Milestone 7 — Главная
    Hero-секция                     :         m7a, after m6c, 1d
    Популярные модели + промпты     :         m7b, after m7a, 1d
    Страница /about                 :         m7c, after m7b, 1d

    section ✨ Milestone 8 — Полировка
    Адаптив (мобильный вид)         :         m8a, after m7c, 1d
    Skeleton / Spinner / Toast      :         m8b, after m8a, 1d
    SEO, favicon, мета-теги         :         m8c, after m8b, 1d

    section 🚀 Milestone 9 — Продакшен
    Финальный деплой на Vercel      :         m9a, after m8c, 1d
    Vercel Analytics + проверка     :         m9b, after m9a, 1d
```

---

## Сводка по этапам

| # | Milestone | Длительность | Ключевой результат |
|---|---|---|---|
| 0 | Подготовка | ✅ Готово | Среда настроена |
| 1 | Фундамент | 4 дня | Работающий скелет на Vercel |
| 2 | База данных | 3 дня | Все таблицы и данные в Supabase |
| 3 | Каталог AI | 4 дня | Рабочий каталог с карточками |
| 4 | Авторизация | 3 дня | Вход и регистрация работают |
| 5 | Промпты | 4 дня | Полная библиотека промптов |
| 6 | Профиль | 3 дня | Личный кабинет пользователя |
| 7 | Главная | 3 дня | Главная страница и About |
| 8 | Полировка | 3 дня | Адаптив, анимации, SEO |
| 9 | Деплой | 2 дня | Продакшен-версия готова |

**Итого: ~3 недели**
