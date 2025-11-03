# CLAUDE.md

Компактное руководство для AI-агента при работе с монорепозиторием и вспомогательными скриптами. Написан в стиле ISTJ (MBTI), Максим Горький (Соционика), бирюзовый уровень (Спиральная Динамика). Минимум токенов, фокус на ценность.

Данный документ — краткое пояснение к проекту для эффективной работы агента. При внесении изменений в проект, затрагивающих логику или описание разделов этого файла, агент обязан самостоятельно актуализировать соответствующие разделы. Формулировки должны быть точными, понятными как человеку, так и AI (стиль: ISTJ, бирюзовый). Структурирование разделов и выбор приоритетов — прерогатива пользователя.

## Смысл и принцип

- оригинальный репозиторий: [ts-monorepo](https://github.com/d-mozulyov/ts-monorepo)
- назначение: TypeScript monorepo template — управление несколькими связанными проектами в едином репозитории
- основа: npm workspaces + симлинки для переиспользуемого кода в [shared/](shared/)
- автоматизация: CLI-скрипты в [shared/cli](shared/cli/) на JavaScript с кроссплатформенными обёртками create-new.cmd/setup.cmd
- принцип: независимая сборка каждого проекта, централизованное управление зависимостями, TypeScript path aliases через симлинки
- совместимость: Windows, Linux, macOS
- `create-new.cmd` / `create-new.js` — создание/удаление проектов и модулей
  - Без аргументов: `create-new.cmd` — интерактивное меню для выбора типа проекта
  - Создание: `create-new.cmd "Empty Node.js" my-app` или `create-new.cmd React my-app --git`
  - Удаление: `create-new.cmd --remove my-app` — удаляет проект или shared модуль
  - Симлинк: `create-new.cmd --symlink my-app src/custom shared/lib` — добавляет симлинк к проекту
- `setup.cmd` / `setup.js` — установка зависимостей и создание симлинков (вместо `npm install`)
  - Без аргументов: `setup.cmd` — устанавливает зависимости для всего монорепо, создаёт симлинки для всех проектов
  - С аргументами: `setup.cmd app` или `setup.cmd project1 project2` — устанавливает зависимости и создаёт симлинки для указанных проектов

## Задачи в бэклоге

- ToDo

## Технологии и запуск

- стек: TypeScript, JavaScript (ES modules), Node.js, npm workspaces
- требования: Node.js, права администратора на Windows для симлинков
- логи/ошибки: на английском

## Стиль общения агента

- язык: только русский; комментарии в коде на английском; константы ошибок и исключений на английском
- тон: спокойный, уважительный, партнёрский
- техника: человеческие темы — эмпатично и кратко; техподробности — структурно и точно
- прозрачность: коротко фиксируем «что делаем/зачем/критерии», поддерживаем общее поле
- ISTJ, бирюзовый уровень

## Философия разработки

- принципы: KISS + Бритва Оккама + YAGNI — простота, минимализм, никакой спекуляции
- минимум абстракций: не создавай классы/функции "на будущее", только для реальной задачи
- явное > неявного: код читается как инструкция, без скрытой магии
- одна ответственность: функция делает одно, модуль решает одну задачу
- прямолинейность: решение очевидно при чтении → правильно; требует расшифровки → переделай
- простота > элегантности: работающий прямой код лучше "красивого" сложного

## Импорты

- импорты только статические, строго в начале файла!
- порядок: 1) Node.js builtin 2) внешние пакеты 3) внутренние модули
- сортировка внутри группы по имени; дубли объединять
- >80 символов — многострочно

## Комментарии

- `//` — логика внутри функций (при необходимости несколькими строками) или короткие описания типов/классов/функций
- `/** */` — шапка модуля и многострочные описания типов/классов/функций
- язык: английский для всех комментариев в коде
- ISTJ, бирюзовый уровень

## Структура проектов

Каждый проект в монорепозитории имеет:
- package.json — описание проекта, зависимости, скрипты
- setup.json — конфигурация для CLI-скриптов (тип проекта, builddir, production paths, symlinks)
- tsconfig.json — конфигурация TypeScript
- .vscode/ — настройки VSCode (launch.json, tasks.json, settings.json)
- src/ — исходный код
- Симлинк src/@shared → [shared/](shared/) — доступ к общему коду

## VSCode: Отладка и тестирование

Монорепозиторий включает готовую конфигурацию для VSCode:

**Корневой .vscode/ (для всего монорепо):**
- launch.json — содержит конфигурации запуска:
  - "Setup" — запуск скрипта настройки всего монорепо
  - "Create New Project" — запуск интерактивного меню создания проектов
  - "Create Project Lock" — генерация project-specific package-lock.json
  - "Create [Type]" — быстрое создание проектов различных типов (React, Angular, Express и т.д.) с автоматическим удалением перед созданием
- tasks.json — задачи для создания и удаления проектов каждого типа
- settings.json — общие настройки редактора (форматирование, ESLint, exclusions)

**Проектный .vscode/ (для каждого проекта):**
- Автоматически создаётся при генерации проекта через create-new.js
- Содержит специфичные для проекта конфигурации запуска и отладки
- Настройки зависят от типа проекта (Node.js, React, Electron и т.д.)

**Использование:**
- Запуск/отладка: F5 или через панель "Run and Debug" → выбор нужной конфигурации
- Задачи: Terminal → Run Task → выбор задачи создания/удаления проекта
- Breakpoints: работают автоматически благодаря настройкам в launch.json

## Утилита setup.js

**Назначение:** Первичная настройка монорепозитория и проектов — создание симлинков и установка зависимостей.

**Использование:**
```bash
# Установка всех проектов в монорепозитории
node shared/cli/setup.js

# Установка конкретных проектов
node shared/cli/setup.js app
node shared/cli/setup.js project1 project2
```

**Логика работы:**
1. Проверяет права на создание симлинков (Windows требует прав администратора)
2. Валидирует наличие корневого [package.json](package.json)
3. Без аргументов: читает workspaces из package.json, настраивает все проекты, устанавливает зависимости для всего монорепо
4. С аргументами: настраивает указанные проекты и устанавливает зависимости для каждого отдельно

**Ключевые функции:**
- installDependencies(projectName) — выполняет `npm install` для проекта или всего монорепо
- main() — точка входа, координирует весь процесс настройки

**Важно:** Скрипт создает относительные симлинки на основе конфигурации setup.json каждого проекта.

## Утилита create-new.js

**Назначение:** Интерактивное создание и удаление проектов/модулей с полной интеграцией в монорепозиторий.

**Использование:**
```bash
# Интерактивный режим с меню
node shared/cli/create-new.js

# Создание проекта напрямую
node shared/cli/create-new.js "Empty Node.js" my-app
node shared/cli/create-new.js React my-react-app --git
node shared/cli/create-new.js "Electron React" my-electron-app --nogit

# Создание shared модуля
node shared/cli/create-new.js "Shared module" utils/helpers.ts

# Удаление проекта или модуля
node shared/cli/create-new.js --remove my-app
node shared/cli/create-new.js --remove utils/helpers.ts

# Добавление симлинка к проекту
node shared/cli/create-new.js --symlink my-app src/custom shared/custom-lib
```

**Поддерживаемые типы проектов:**
- Базовые: Shared module, Empty Node.js
- Frontend: React, Next.js, Angular, Vue.js, Svelte
- Backend: Express.js, NestJS, Fastify (TODO), AdonisJS (TODO), FeathersJS (TODO)
- Mobile: React Native (TODO), Expo (TODO), NativeScript (TODO), Ionic (TODO), Capacitor.js (TODO)
- Desktop: Electron (Solid/React/Vue/Svelte/Vanilla), Tauri (TODO), Neutralino.js (TODO), Proton Native (TODO), Sciter (TODO)

**Логика создания проекта:**
1. Интерактивный выбор типа через меню со стрелками или прямое указание
2. Запрос имени проекта с валидацией (только буквы, цифры, дефисы, подчёркивания)
3. Вызов внешних генераторов (Vite, Angular CLI, NestJS CLI, create-electron и т.д.)
4. Настройка через [create-new-project.js](shared/cli/create-new-project.js):
   - Генерация package.json с обязательными скриптами (build, dev, test и т.д.)
   - Создание tsconfig.json, setup.json
   - Создание .vscode/ директории с конфигами (launch.json, tasks.json, settings.json)
   - Настройка ESLint, Jest/Vitest
   - Создание симлинка src/@shared → [shared/](shared/)
   - Добавление в .gitignore
5. Обновление корневого package.json (workspaces, скрипты для проекта)
6. Создание симлинков через setupProjectSymlinks
7. Установка зависимостей через `npm install`
8. Опциональное добавление в Git

**Логика создания shared модуля:**
1. Запрос имени модуля (например, `utils/helpers.ts`)
2. Валидация: не должен начинаться с `/`, использовать `/` вместо `\`, заканчиваться на `.ts`
3. Создание файла с базовым шаблоном
4. Автоматическое обновление всех родительских index.ts файлов с добавлением `export * from './relative-path'`
5. Создание недостающих index.ts файлов в иерархии
6. Опциональное добавление в Git

**Логика удаления:**
- Проект: удаляет из workspaces, удаляет скрипты из корневого package.json, удаляет директорию через Git, выполняет `npm uninstall`
- Модуль: удаляет файл, очищает экспорты из всех родительских index.ts, удаляет пустые index.ts и директории

**Ключевые функции:**
- parseArguments() — парсит аргументы командной строки
- createInteractiveMenu(title, options) — создает меню с навигацией ↑/↓ и Enter
- createNewSharedModule(moduleName) — создает модуль в [shared/](shared/) с автоматическим обновлением index.ts
- removeProjectOrModule(name) — удаляет проект или модуль с полной очисткой
- tryAddFilesToGit(files, gitOption) — добавляет файлы в Git с подтверждением (`--git` / `--nogit` / `ask`)
- main() — точка входа, координирует весь процесс

**Важно:** Скрипт требует прав администратора на Windows для создания симлинков.

## Иерархия shared/cli/

- [project-utils.js](shared/cli/project-utils.js) — утилиты для работы с проектами
  - __debug, __clidir, __shareddir, __rootdir — константы путей к директориям
  - colors — объект с функциями форматирования текста (red, green, yellow, blue, gray, bold, italic)
  - hasSymlinkPermissions() — проверяет наличие прав на создание симлинков (кэшируется)
  - hasGit() — проверяет наличие Git в репозитории (кэшируется)
  - getProjectDir(projectName, isLocal) — генерирует путь к директории проекта
  - getProjectPackageName(projectName) — генерирует имя пакета в формате @monorepo/project-name
  - getProjectFullPath(projectName, value, allowShared) — разрешает путь с поддержкой логики SHARED
  - jsonStringify(value, compact) — конвертирует значение в JSON с опциональным форматированием
  - setupSymlink(fullSymlinkPath, fullSourcePath) — создает относительный симлинк
  - setupProjectSymlinks(projectName) — создает все симлинки из setup.json для проекта
  - createProjectSettings(projectName, projectType) — создает объект настроек проекта
    - basic — базовые поля: projectDir, packageName, files, dependencies, devDependencies, defaultScripts
    - func — функции: getFullPath, addFile, addDependencies, addDevDependencies, addEslintDependencies, addJestDependencies, gitignore, ignoreDir, addSymlink, setSourceDir, setBuildDir, saveFile, save, install
    - vscode — функции VSCode: add, debug, duplicate, save

- [create-new.js](shared/cli/create-new.js) — интерактивное создание проектов и модулей
  - parseArguments() — парсит аргументы командной строки (--remove, --symlink, тип проекта, --git/--nogit)
  - tryAddFilesToGit(files, gitOption) — добавляет файлы в Git с подтверждением
  - createInteractiveMenu(title, options) — создает меню с навигацией стрелками
  - createPrompt() — создает readline интерфейс
  - askYesNo(question) — задает yes/no вопрос
  - foreachIndexFile(modulePath, callback) — итерируется по index.ts файлам в родительских директориях
  - createNewSharedModule(moduleName) — создает новый модуль в [shared/](shared/) с автоматическим обновлением index.ts
  - safeRemove(targetPath) — безопасно удаляет файл/директорию через Git
  - removeProjectOrModule(name) — удаляет проект или модуль (обновляет package.json, workspaces)
  - selectOperation() — интерактивный выбор типа проекта через меню
  - main() — основная логика: обрабатывает аргументы, вызывает создание/удаление, добавляет в Git

- [create-new-project.js](shared/cli/create-new-project.js) — создание новых проектов различных типов
  - SettingsHelper — вспомогательный класс для настроек проекта
    - getUnimplementedProjectTypeError() — генерирует сообщение об ошибке для нереализованных типов
    - apply(config) — применяет конфигурацию (sourceDir, buildDir, ignore, dependencies, eslint, jest, symlinks, production, debug, scripts, compilerOptions)
  - createNewProject(projectType, projectName) — создает новый проект заданного типа
  - createProjectByType(projectName, projectType) — диспетчер создания проектов
  - createEmptyNodeProject(settings) — создает пустой Node.js проект
  - createReactProject(settings) — создает React проект через Vite
  - createNextJsProject(settings) — создает Next.js проект
  - createAngularProject(settings) — создает Angular проект
  - createVueProject(settings) — создает Vue.js проект через Vite
  - createSvelteProject(settings) — создает Svelte проект через Vite
  - createExpressProject(settings) — создает Express.js проект
  - createNestJsProject(settings) — создает NestJS проект
  - createElectronProject(settings) — создает Electron проект с различными фреймворками
  - prepareProjectPackage(settings) — подготавливает package.json с обязательными скриптами
  - prepareProjectVSCodeConfigs(settings) — создает конфигурации VSCode (launch.json, tasks.json, settings.json)
  - prepareProjectOtherConfigs(settings) — создает tsconfig.json, .gitignore, setup.json
  - updateMonorepoConfigs(settings) — обновляет корневой package.json (workspaces, скрипты)
  - createNewSymlink(projectName, symlinkPath, sourcePath) — создает единичный симлинк для проекта

- [create-project-lock.js](shared/cli/create-project-lock.js) — создание project-specific package-lock.json
  - saveLockData(fileName) — сохраняет lock-данные в файл
  - existsPackage(packagePath) — проверяет существование пакета
  - getPackage(packagePath) — получает объект пакета
  - getPackageVersion(packagePath) — получает версию пакета
  - getPackageName(packagePath) — извлекает имя пакета из пути
  - getParentPackagePath(packagePath) — получает путь к родительскому пакету
  - getChildPackagePath(parentPackagePath, childPackageName) — формирует путь к дочернему пакету
  - processDeps(packagePathOrObj, callback) — обрабатывает dependencies и devDependencies
  - getDepEntry(packagePathOrObj, depName) — получает запись зависимости
  - changeDepPath(packagePath, newDepPath) — меняет путь зависимости с обновлением owners
  - findDepPackage(packagePath, depName, lookChild) — находит пакет зависимости в иерархии node_modules
  - findBestDepPath(packagePath, depName, depVersion, lookChild) — находит оптимальный путь для зависимости
  - attachOwner(packagePathOrObj, ownerPackagePath) — добавляет владельца в массив owners
  - detachOwner(packagePath, ownerPackagePath) — удаляет владельца и рекурсивно очищает неиспользуемые пакеты
  - createPackageCopy(newPackagePath, sourcePackagePath, ownerPackagePath) — создает копию пакета с разрешением зависимостей
  - decomposePackage(packagePath) — декомпозирует пакет и копирует его владельцам
  - prepareLockDataPaths(packagePath, processedPackages) — подготавливает пути в lock-данных рекурсивно
  - prepareLockData() — обрабатывает начальный пакет и очищает неиспользуемые пакеты
  - normalizeStartPackage() — перемещает все зависимости стартового пакета на корневой уровень
  - prepareNormalizedLockData() — удаляет стартовый пакет и сортирует пакеты
  - optimizeLockData() — оптимизирует структуру lock-файла (TODO)
  - cleanUpLockData() — заменяет объекты зависимостей на строки версий
  - createProjectLockFile(projectInfoPath, projectLockPath) — создает project-specific package-lock.json
  - createProjectLock(projectName, productionMode) — главная функция создания lock-файла проекта
  - main() — entry point для standalone выполнения

- [deploy/vps-pm2.js](shared/cli/deploy/vps-pm2.js) — деплой на VPS через PM2
  - Константы: projectSlug, profile, baseDir, packageLockPath, pm2ProcessName, archivePath
  - Логика: проверяет архив, останавливает PM2-процесс, очищает директорию (кроме logs), распаковывает архив, устанавливает зависимости (npm ci или npm install), запускает через PM2, настраивает autostart
