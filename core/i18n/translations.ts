import type { Locale } from "@/types/locale";

export const translations: Record<string, Record<Locale, string>> = {
  // Taskbar / start button
  "start.button": { kk: "Бастау", ru: "Пуск", en: "Start" },
  "taskbar.aria": {
    kk: "Тапсырмалар тақтасы",
    ru: "Панель задач",
    en: "Taskbar",
  },
  "startmenu.aria": { kk: "Бастау мәзірі", ru: "Меню Пуск", en: "Start menu" },
  "user.name": { kk: "Тамирлан", ru: "Тамирлан", en: "Tamirlan" },
  "os.tagline": {
    kk: "Тамирланның портфолиосы",
    ru: "Портфолио Тамирлана",
    en: "Tamirlan's Portfolio",
  },

  // Start menu buttons
  "start.allPrograms": {
    kk: "Барлық бағдарламалар",
    ru: "Все программы",
    en: "All Programs",
  },
  "start.recent": {
    kk: "Соңғы бағдарламалар",
    ru: "Недавние программы",
    en: "Recently Used",
  },
  "start.logoff": { kk: "Шығу", ru: "Выход", en: "Log Off" },
  "start.shutdown": { kk: "Өшіру", ru: "Выключить", en: "Shut Down" },
  "start.settings": { kk: "Параметрлер", ru: "Параметры", en: "Settings" },
  "start.search": { kk: "Іздеу", ru: "Поиск", en: "Search" },
  "start.terminal": { kk: "Терминал", ru: "Терминал", en: "Terminal" },
  "start.run": { kk: "Орындау...", ru: "Выполнить...", en: "Run..." },

  // Start menu primary items
  "start.myProjects": {
    kk: "Менің жобаларым",
    ru: "Мои проекты",
    en: "My Projects",
  },
  "start.myProjects.sub": {
    kk: "Жұмыстарымды қарау",
    ru: "Смотреть работы",
    en: "View my work",
  },
  "start.myResume": {
    kk: "Менің түйіндемем",
    ru: "Моё резюме",
    en: "My Resume",
  },
  "start.myResume.sub": {
    kk: "Интерактивті CV",
    ru: "Интерактивное CV",
    en: "Interactive CV",
  },
  "start.aboutSub": {
    kk: "Кәсіби профиль",
    ru: "Профессиональный профиль",
    en: "Professional profile",
  },
  "start.contactSub": {
    kk: "Маған жазу",
    ru: "Написать мне",
    en: "Send me a message",
  },

  // Application titles
  "app.welcome": {
    kk: "TamirlanOS-қа қош келдіңіз",
    ru: "Добро пожаловать в TamirlanOS",
    en: "Welcome to TamirlanOS",
  },
  "app.portfolio": {
    kk: "Портфолио шолғышы",
    ru: "Проводник портфолио",
    en: "Portfolio Explorer",
  },
  "app.about-me": { kk: "Мен туралы", ru: "Обо мне", en: "About Me" },
  "app.projects": { kk: "Жобалар", ru: "Проекты", en: "Projects" },
  "app.skills": { kk: "Дағдылар", ru: "Навыки", en: "Skills" },
  "app.contact": { kk: "Байланыс", ru: "Контакты", en: "Contact" },
  "app.resume": { kk: "Түйіндеме", ru: "Резюме", en: "Resume" },
  "app.photography": { kk: "Фотография", ru: "Фотография", en: "Photography" },
  "app.gallery-3d": {
    kk: "3D-галерея",
    ru: "3D-галерея",
    en: "3D Gallery",
  },
  "app.timeline": { kk: "Хронология", ru: "Хронология", en: "Timeline" },
  "app.certificates": {
    kk: "Сертификаттар",
    ru: "Сертификаты",
    en: "Certificates",
  },
  "app.ideas": { kk: "Идеялар", ru: "Идеи", en: "Ideas" },
  "app.paint": { kk: "Paint", ru: "Paint", en: "Paint" },
  "app.minesweeper": { kk: "Миналар", ru: "Сапёр", en: "Minesweeper" },
  "app.checkers": { kk: "Дойбы", ru: "Шашки", en: "Checkers" },
  "app.game-2048": { kk: "2048", ru: "2048", en: "2048" },
  "app.tic-tac-toe": {
    kk: "Айқыш-ұйқыш",
    ru: "Крестики-нолики",
    en: "Tic-Tac-Toe",
  },
  "g2048.score": { kk: "Ұпай", ru: "Счёт", en: "Score" },
  "g2048.hint": {
    kk: "Көрсеткілер немесе свайп",
    ru: "Стрелки или свайп",
    en: "Arrows or swipe",
  },
  "g2048.win": {
    kk: "2048! Жеңіс",
    ru: "2048! Победа",
    en: "You reached 2048!",
  },
  "g2048.over": { kk: "Жүріс жоқ", ru: "Ходов нет", en: "No moves left" },
  "ttt.turnX": { kk: "X жүрісі", ru: "Ход X", en: "X's turn" },
  "ttt.turnO": { kk: "O жүрісі", ru: "Ход O", en: "O's turn" },
  "ttt.winX": { kk: "X жеңді!", ru: "Победа X", en: "X wins!" },
  "ttt.winO": { kk: "O жеңді!", ru: "Победа O", en: "O wins!" },
  "ttt.draw": { kk: "Тең", ru: "Ничья", en: "Draw" },

  // Desktop icon labels (short)
  "desktop.portfolio": { kk: "Портфолио", ru: "Портфолио", en: "Portfolio" },

  // Window chrome
  "win.file": { kk: "Файл", ru: "Файл", en: "File" },
  "win.edit": { kk: "Түзету", ru: "Правка", en: "Edit" },
  "win.view": { kk: "Көрініс", ru: "Вид", en: "View" },
  "win.favorites": { kk: "Таңдаулылар", ru: "Избранное", en: "Favorites" },
  "win.help": { kk: "Анықтама", ru: "Справка", en: "Help" },
  "win.close": { kk: "Жабу", ru: "Закрыть", en: "Close" },
  "win.undo": { kk: "Болдырмау", ru: "Отменить", en: "Undo" },
  "win.redo": { kk: "Қайталау", ru: "Повторить", en: "Redo" },
  "win.toolbar": {
    kk: "Құралдар тақтасы",
    ru: "Панель инструментов",
    en: "Toolbar",
  },
  "win.statusbar": {
    kk: "Күй жолағы",
    ru: "Строка состояния",
    en: "Status bar",
  },
  "win.addFavorite": {
    kk: "Таңдаулыларға қосу",
    ru: "Добавить в избранное",
    en: "Add to Favorites",
  },
  "win.about": {
    kk: "TamirlanOS туралы",
    ru: "О TamirlanOS",
    en: "About TamirlanOS",
  },
  "win.back": { kk: "Артқа", ru: "Назад", en: "Back" },
  "win.forward": { kk: "Алға", ru: "Вперёд", en: "Forward" },
  "win.up": { kk: "Жоғары", ru: "Вверх", en: "Up" },
  "win.address": { kk: "Мекенжай", ru: "Адрес", en: "Address" },
  "win.go": { kk: "Өту", ru: "Переход", en: "Go" },
  "win.done": { kk: "Дайын", ru: "Готово", en: "Done" },
  "win.minimize": { kk: "Жию", ru: "Свернуть", en: "Minimize" },
  "win.maximize": { kk: "Жаю", ru: "Развернуть", en: "Maximize" },
  "win.restore": { kk: "Қалпына келтіру", ru: "Восстановить", en: "Restore" },

  // Shutdown dialog
  "shutdown.title": {
    kk: "Компьютерді өшіру",
    ru: "Выключение компьютера",
    en: "Turn off computer",
  },
  "shutdown.turnoff": { kk: "Өшіру", ru: "Выключить", en: "Turn Off" },
  "shutdown.restart": { kk: "Қайта қосу", ru: "Перезагрузка", en: "Restart" },
  "common.cancel": { kk: "Болдырмау", ru: "Отмена", en: "Cancel" },

  // Login
  "login.role": {
    kk: "Әзірлеуші · AI-инженер",
    ru: "Разработчик · AI-инженер",
    en: "Developer · AI Engineer",
  },
  "login.begin": {
    kk: "Бастау үшін «{name}» түймесін басыңыз",
    ru: "Чтобы начать, нажмите на «{name}»",
    en: "To begin, click on {name}",
  },
  "login.restart": {
    kk: "TamirlanOS-ты қайта қосу",
    ru: "Перезагрузить TamirlanOS",
    en: "Restart TamirlanOS",
  },
  "login.signin": {
    kk: "{name} ретінде кіру",
    ru: "Войти как {name}",
    en: "Sign in as {name}",
  },

  // Boot
  "boot.memtest": {
    kk: "Жадты тексеру ....... OK",
    ru: "Проверка памяти ..... OK",
    en: "Memory test ......... OK",
  },
  "boot.audio": {
    kk: "Аудиоқұрылғы ........ OK",
    ru: "Аудиоустройство ..... OK",
    en: "Audio device ........ OK",
  },
  "boot.display": {
    kk: "Бейнеадаптер ........ OK",
    ru: "Видеоадаптер ........ OK",
    en: "Display adapter ..... OK",
  },
  "boot.booting": {
    kk: "TamirlanOS жүктелуде...",
    ru: "Загрузка TamirlanOS...",
    en: "Booting TamirlanOS...",
  },
  "boot.loading": {
    kk: "TamirlanOS жүктелуде",
    ru: "Загрузка TamirlanOS",
    en: "Loading TamirlanOS",
  },
  "boot.welcome": {
    kk: "TamirlanOS-қа қош келдіңіз",
    ru: "Добро пожаловать в TamirlanOS",
    en: "Welcome to TamirlanOS",
  },
  "boot.ready": { kk: "Жүйе дайын", ru: "Система готова", en: "System ready" },
  "boot.preparing": {
    kk: "Жұмыс үстелі дайындалуда...",
    ru: "Подготовка рабочего стола...",
    en: "Preparing desktop...",
  },
  "boot.shuttingdown": {
    kk: "TamirlanOS жұмысты аяқтауда...",
    ru: "TamirlanOS завершает работу...",
    en: "TamirlanOS is shutting down...",
  },
  "boot.poweron": {
    kk: "TamirlanOS-ты қосу",
    ru: "Включить TamirlanOS",
    en: "Power on TamirlanOS",
  },
  "loading.tip": {
    kk: "Ең жақсы әсер үшін толық экранды қосыңыз (F11)",
    ru: "Для лучшего впечатления включите полный экран (F11)",
    en: "For the best experience enter full screen (F11)",
  },
  "loading.portfolio": {
    kk: "Портфолио",
    ru: "Портфолио",
    en: "Portfolio",
  },

  // Welcome balloon
  "balloon.body": {
    kk: "XP стиліндегі интерфейс — жұмыстарым мен ұқыптылығымды көрсету үшін қолмен жасалған.",
    ru: "Точная копия интерфейса в стиле XP, собранная вручную, чтобы показать мои работы и внимание к деталям.",
    en: "A faithful XP-style interface, hand-built to showcase my work and attention to detail.",
  },
  "balloon.start": { kk: "Бастау", ru: "Начать", en: "Get Started" },
  "balloon.close": {
    kk: "Кеңесті жабу",
    ru: "Закрыть подсказку",
    en: "Close welcome tip",
  },

  // Paint
  "paint.eraser": { kk: "Өшіргіш", ru: "Ластик", en: "Eraser" },
  "paint.clear": { kk: "Тазалау", ru: "Очистить", en: "Clear" },
  "paint.color": { kk: "Түс", ru: "Цвет", en: "Color" },

  // Minesweeper
  "mine.new": { kk: "Жаңа ойын", ru: "Новая игра", en: "New game" },
  "mine.won": {
    kk: "Жеңіс! Барлық миналар табылды.",
    ru: "Победа! Все мины найдены.",
    en: "You win! All mines found.",
  },
  "mine.lost": {
    kk: "Жарылыс! Жаңа ойын үшін смайликті басыңыз.",
    ru: "Взрыв! Нажмите на смайлик для новой игры.",
    en: "Boom! Click the face for a new game.",
  },
  "mine.hint": {
    kk: "Сол батырма — ашу, оң батырма (немесе 🚩 режимі) — жалауша.",
    ru: "ЛКМ — открыть, ПКМ (или режим 🚩) — флажок.",
    en: "Left-click to reveal, right-click (or 🚩 mode) to flag.",
  },
  "common.on": { kk: "қосу", ru: "вкл", en: "on" },
  "common.off": { kk: "өшіру", ru: "выкл", en: "off" },

  // Checkers
  "chk.turnRed": {
    kk: "Қызылдардың жүрісі",
    ru: "Ход красных",
    en: "Red's turn",
  },
  "chk.turnBlack": {
    kk: "Қаралардың жүрісі",
    ru: "Ход чёрных",
    en: "Black's turn",
  },
  "chk.winRed": {
    kk: "Қызылдар жеңді!",
    ru: "Победа красных!",
    en: "Red wins!",
  },
  "chk.winBlack": {
    kk: "Қаралар жеңді!",
    ru: "Победа чёрных!",
    en: "Black wins!",
  },
  "chk.new": { kk: "Жаңа партия", ru: "Новая партия", en: "New game" },
  "chk.vsAI": { kk: "ЖИ-ге қарсы", ru: "Против ИИ", en: "vs Computer" },
  "chk.twoPlayers": { kk: "Екі ойыншы", ru: "Два игрока", en: "Two players" },
  "chk.thinking": {
    kk: "ЖИ ойлануда…",
    ru: "ИИ думает…",
    en: "Computer is thinking…",
  },
  "chk.hint": {
    kk: "Екі ойыншы кезекпен. Алу міндетті — әрі қарай алсаң, қайта жүресің.",
    ru: "Два игрока по очереди. Взятие обязательно, бьёшь дальше — ходишь снова.",
    en: "Two players take turns. Captures are mandatory; keep jumping to move again.",
  },

  // Photography
  "photo.subtitle": {
    kk: "Санаттар бойынша суреттерім. Өз фотоларыңызды қосыңыз — олар осы браузерде сақталады.",
    ru: "Мои снимки по категориям. Добавляйте свои фото — они сохраняются в этом браузере.",
    en: "My shots by category. Add your own photos — they are stored in this browser.",
  },
  "photo.add": { kk: "Фото қосу", ru: "Добавить фото", en: "Add photo" },
  "photo.upload": {
    kk: "Фото жүктеу",
    ru: "Загрузить фото",
    en: "Upload photo",
  },
  "photo.empty": {
    kk: "«{cat}» санатында әзірше фото жоқ.",
    ru: "В категории «{cat}» пока нет фото.",
    en: 'No photos in "{cat}" yet.',
  },
  "photo.loading": { kk: "Жүктелуде…", ru: "Загрузка…", en: "Loading…" },
  "photo.delete": { kk: "Жою", ru: "Удалить", en: "Delete" },
  "photo.close": { kk: "Жабу", ru: "Закрыть", en: "Close" },
  "cat.city": { kk: "Қала", ru: "Город", en: "City" },
  "cat.people": { kk: "Адамдар", ru: "Люди", en: "People" },
  "cat.street": { kk: "Стрит", ru: "Стрит", en: "Street" },
  "cat.nature": { kk: "Табиғат", ru: "Природа", en: "Nature" },

  // Portfolio
  "portfolio.installed": {
    kk: "Орнатылған бағдарламалар",
    ru: "Установленные приложения",
    en: "Installed applications",
  },
  "portfolio.hintTap": {
    kk: "TamirlanOS құрамындағының бәрі. Ашу үшін түртіңіз.",
    ru: "Всё, что входит в TamirlanOS. Коснитесь, чтобы открыть.",
    en: "Everything in TamirlanOS. Tap to open.",
  },
  "portfolio.hintClick": {
    kk: "TamirlanOS құрамындағының бәрі. Ашу үшін екі рет басыңыз.",
    ru: "Всё, что входит в TamirlanOS. Дважды кликните, чтобы открыть.",
    en: "Everything in TamirlanOS. Double-click to open.",
  },

  // Welcome app
  "welcome.subtitle": {
    kk: "Жүйе сіздің қолыңызда — ол қалай жұмыс істейтіні мынау.",
    ru: "Система в вашем распоряжении — вот как она работает.",
    en: "The system is yours to explore — here is how it works.",
  },
  "welcome.step1": {
    kk: "Бағдарламаны ашу үшін жұмыс үстеліндегі белгішені екі рет басыңыз. Мұндағының бәрі нақты әрі зерттеуге ашық.",
    ru: "Дважды кликните по иконке на рабочем столе, чтобы открыть приложение. Всё здесь настоящее и доступно для изучения.",
    en: "Double-click a desktop icon to open an app. Everything here is real and explorable.",
  },
  "welcome.step2": {
    kk: "Терезелерді тақырып жолағынан сүйреңіз, кез келген шеттен өлшемін өзгертіңіз, тапсырмалар тақтасынан ауысыңыз.",
    ru: "Перетаскивайте окна за заголовок, меняйте размер за любой край и переключайтесь между ними через панель задач.",
    en: "Drag windows by the title bar, resize from any edge, and switch via the taskbar.",
  },
  "welcome.step3": {
    kk: "Жасыл «Бастау» түймесінде — барлық бағдарламалар, сондай-ақ аяқтағанда «Өшіру».",
    ru: "В зелёной кнопке «Пуск» — все приложения, а также «Выключить компьютер», когда закончите.",
    en: "The green Start button holds every app, plus Turn Off when you're done.",
  },
  "welcome.step4": {
    kk: "Сағат жанындағы трейде: осы турды қайта ашу, ЭЛТ-мониторын қосу немесе толық экран (F11).",
    ru: "В трее у часов: заново открыть этот тур, включить эффект ЭЛТ-монитора или перейти в полный экран (работает и F11).",
    en: "In the tray by the clock: reopen this tour, toggle the CRT effect, or go fullscreen (F11).",
  },
  "welcome.footer": {
    kk: "Тамирлан Жамалов жасаған · Tamirlan Studio",
    ru: "Сделано Тамирланом Жамаловым · Tamirlan Studio",
    en: "Built by Tamirlan Zhamalov · Tamirlan Studio",
  },
};
