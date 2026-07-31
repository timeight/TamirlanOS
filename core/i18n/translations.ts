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
  "app.shooter": { kk: "Арена-шутер", ru: "Арена-шутер", en: "Arena Shooter" },
  "shooter.score": { kk: "Ұпай", ru: "Очки", en: "Score" },
  "shooter.wave": { kk: "Толқын", ru: "Волна", en: "Wave" },
  "shooter.over": { kk: "Ойын аяқталды", ru: "Игра окончена", en: "Game over" },
  "shooter.hint": {
    kk: "WASD — жүру, тінтуір — көздеу, басу — ату. Телефонда — саусақ.",
    ru: "WASD — движение, мышь — прицел, ЛКМ — огонь. На телефоне — палец.",
    en: "WASD to move, mouse to aim, click to shoot. Touch: drag to play.",
  },

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
  "win.showHidden": {
    kk: "Жасырын файлдарды көрсету",
    ru: "Показать скрытые файлы",
    en: "Show Hidden Files",
  },
  "fs.emptyFolder": {
    kk: "Бұл қалта бос",
    ru: "Эта папка пуста",
    en: "This folder is empty",
  },
  "fs.objects": {
    kk: "Объектілер: {count}",
    ru: "Объектов: {count}",
    en: "{count} objects",
  },
  "fs.myComputer": {
    kk: "Менің компьютерім",
    ru: "Мой компьютер",
    en: "My Computer",
  },
  "files.hiddenGroup": {
    kk: "Жасырын файлдар",
    ru: "Скрытые файлы",
    en: "Hidden files",
  },
  "files.readonly": {
    kk: "Тек оқу",
    ru: "Только чтение",
    en: "Read-only",
  },
  "files.empty": {
    kk: "Файл таңдалмаған",
    ru: "Файл не выбран",
    en: "No file selected",
  },
  "app.recycle-bin": { kk: "Себет", ru: "Корзина", en: "Recycle Bin" },

  // Internet Explorer
  "app.ie": {
    kk: "Internet Explorer",
    ru: "Internet Explorer",
    en: "Internet Explorer",
  },
  "ie.menu.tools": { kk: "Құралдар", ru: "Сервис", en: "Tools" },
  "ie.stop": { kk: "Тоқтату", ru: "Стоп", en: "Stop" },
  "ie.refresh": { kk: "Жаңарту", ru: "Обновить", en: "Refresh" },
  "ie.home": { kk: "Басты бет", ru: "Домой", en: "Home" },
  "ie.zone": {
    kk: "Интернет",
    ru: "Интернет",
    en: "Internet",
  },
  "ie.status.opening": {
    kk: "Бет ашылуда...",
    ru: "Открытие страницы...",
    en: "Opening page...",
  },
  "ie.status.connecting": {
    kk: "Қосылуда...",
    ru: "Соединение...",
    en: "Connecting...",
  },
  "ie.status.loading": {
    kk: "Жүктелуде...",
    ru: "Загрузка...",
    en: "Loading...",
  },
  "ie.status.done": { kk: "Дайын", ru: "Готово", en: "Done" },
  "ie.openReal": {
    kk: "Нағыз сайтты ашу",
    ru: "Открыть настоящий сайт",
    en: "Open the real site",
  },
  "ie.openGallery": {
    kk: "Галереяны ашу",
    ru: "Открыть галерею",
    en: "Open the gallery",
  },
  "ie.openResume": {
    kk: "Түйіндемені ашу",
    ru: "Открыть резюме",
    en: "Open the resume",
  },
  "ie.openProjects": {
    kk: "Жобаларды ашу",
    ru: "Открыть проекты",
    en: "Open projects",
  },
  "ie.openAbout": {
    kk: "«Мен туралы» ашу",
    ru: "Открыть «Обо мне»",
    en: "Open About Me",
  },
  "ie.openContact": {
    kk: "Контактілерді ашу",
    ru: "Открыть контакты",
    en: "Open contacts",
  },
  "ie.openIdeas": { kk: "Идеяларды ашу", ru: "Открыть идеи", en: "Open ideas" },
  "ie.openExplorer": {
    kk: "Шолғышты ашу",
    ru: "Открыть проводник",
    en: "Open the explorer",
  },

  "ie.page.home": {
    kk: "Tamirlan Online",
    ru: "Tamirlan Online",
    en: "Tamirlan Online",
  },
  "ie.page.github": { kk: "GitHub", ru: "GitHub", en: "GitHub" },
  "ie.page.linkedin": { kk: "LinkedIn", ru: "LinkedIn", en: "LinkedIn" },
  "ie.page.instagram": { kk: "Instagram", ru: "Instagram", en: "Instagram" },
  "ie.page.telegram": { kk: "Telegram", ru: "Telegram", en: "Telegram" },
  "ie.page.photography": {
    kk: "Фотография",
    ru: "Фотография",
    en: "Photography",
  },
  "ie.page.gallery": { kk: "3D-галерея", ru: "3D-галерея", en: "3D Gallery" },
  "ie.page.resume": { kk: "Түйіндеме", ru: "Резюме", en: "Resume" },
  "ie.page.projects": { kk: "Жобалар", ru: "Проекты", en: "Projects" },
  "ie.page.about": { kk: "Мен туралы", ru: "Обо мне", en: "About" },
  "ie.page.contact": { kk: "Байланыс", ru: "Контакты", en: "Contact" },
  "ie.page.ai": { kk: "AI Lab", ru: "AI Lab", en: "AI Lab" },
  "ie.page.blog": { kk: "Блог", ru: "Блог", en: "Blog" },
  "ie.page.update": {
    kk: "Windows Update",
    ru: "Windows Update",
    en: "Windows Update",
  },
  "ie.page.developer": {
    kk: "Developer Mode",
    ru: "Developer Mode",
    en: "Developer Mode",
  },
  "ie.page.system32": { kk: "system32", ru: "system32", en: "system32" },
  "ie.page.secret": { kk: "secret", ru: "secret", en: "secret" },
  "ie.page.404": {
    kk: "Бет табылмады",
    ru: "Страница не найдена",
    en: "Page not found",
  },

  "ie.home.sub": {
    kk: "Тамирланның цифрлық әлемі",
    ru: "Цифровой мир Тамирлана",
    en: "Tamirlan's digital world",
  },
  "ie.home.welcome": {
    kk: "Tamirlan Online-ға қош келдіңіз.",
    ru: "Добро пожаловать в Tamirlan Online.",
    en: "Welcome to Tamirlan Online.",
  },
  "ie.home.body": {
    kk: "Бұл шолғыш TamirlanOS ішінен шықпай-ақ менің цифрлық әлемімді зерттеуге мүмкіндік береді.",
    ru: "Этот браузер позволяет изучить мой цифровой мир, не покидая TamirlanOS.",
    en: "This browser lets you explore my digital world without leaving TamirlanOS.",
  },
  "ie.home.quickLinks": {
    kk: "Жылдам сілтемелер",
    ru: "Быстрые ссылки",
    en: "Quick links",
  },
  "ie.home.tip": {
    kk: "Кеңес: мекенжай жолағына github, instagram немесе ai деп теріп көріңіз.",
    ru: "Совет: попробуйте набрать в адресной строке github, instagram или ai.",
    en: "Tip: try typing github, instagram or ai in the address bar.",
  },

  "ie.gh.bio": {
    kk: "Әзірлеуші және AI-инженер. Есте қалатын интерфейстер жасаймын.",
    ru: "Разработчик и AI-инженер. Делаю интерфейсы, которые запоминают.",
    en: "Developer and AI engineer. I build interfaces people remember.",
  },
  "ie.gh.pinned": {
    kk: "Бекітілген репозиторийлер",
    ru: "Закреплённые репозитории",
    en: "Pinned repositories",
  },
  "ie.gh.contrib": {
    kk: "Соңғы жарты жылдағы белсенділік",
    ru: "Активность за последние полгода",
    en: "Contributions in the last six months",
  },
  "ie.ig.posts": { kk: "жазба", ru: "публикаций", en: "posts" },
  "ie.ig.followers": { kk: "оқырман", ru: "подписчиков", en: "followers" },
  "ie.ig.following": { kk: "жазылым", ru: "подписок", en: "following" },
  "ie.ig.bio": {
    kk: "Көше · портрет · 3D · подкаст",
    ru: "Стрит · портрет · 3D · подкасты",
    en: "Street · portrait · 3D · podcasts",
  },
  "ie.li.headline": {
    kk: "Әзірлеуші · AI-инженер · Оқытушы",
    ru: "Разработчик · AI-инженер · Преподаватель",
    en: "Developer · AI Engineer · Teacher",
  },
  "ie.li.connections": { kk: "байланыс", ru: "контактов", en: "connections" },
  "ie.li.experience": { kk: "Тәжірибе", ru: "Опыт", en: "Experience" },
  "ie.li.education": { kk: "Білім", ru: "Образование", en: "Education" },
  "ie.li.skills": { kk: "Дағдылар", ru: "Навыки", en: "Skills" },
  "ie.li.job1": {
    kk: "Фриланс: әзірлеу, дизайн, видео",
    ru: "Фриланс: разработка, дизайн, видео",
    en: "Freelance: development, design, video",
  },
  "ie.li.job2": {
    kk: "IT оқытушысы",
    ru: "Преподаватель IT",
    en: "IT teacher",
  },
  "ie.li.job3": {
    kk: "Сарапшы және ұйымдастырушы",
    ru: "Эксперт и организатор",
    en: "Expert and organiser",
  },
  "ie.li.college": { kk: "Колледж", ru: "Колледж", en: "College" },
  "ie.li.edu1": {
    kk: "Ақпараттық жүйелер",
    ru: "Информационные системы",
    en: "Information systems",
  },

  "ie.photo.sub": {
    kk: "Fujifilm X-T2 · XF 35mm F2",
    ru: "Fujifilm X-T2 · XF 35mm F2",
    en: "Fujifilm X-T2 · XF 35mm F2",
  },
  "ie.photo.street": { kk: "Көше", ru: "Стрит", en: "Street" },
  "ie.photo.portrait": { kk: "Портрет", ru: "Портрет", en: "Portrait" },
  "ie.photo.night": { kk: "Түн", ru: "Ночь", en: "Night" },
  "ie.photo.travel": { kk: "Саяхат", ru: "Путешествия", en: "Travel" },

  "ie.ai.sub": {
    kk: "Тәжірибелер мен жұмыстағы жобалар",
    ru: "Эксперименты и проекты в работе",
    en: "Experiments and work in progress",
  },
  "ie.ai.prompt": {
    kk: "Промпт-инжиниринг",
    ru: "Промпт-инжиниринг",
    en: "Prompt engineering",
  },
  "ie.ai.automation": {
    kk: "Автоматтандыру",
    ru: "Автоматизация",
    en: "Automation",
  },
  "ie.ai.llm": { kk: "LLM", ru: "LLM", en: "LLM" },
  "ie.ai.vision": {
    kk: "Компьютерлік көру",
    ru: "Компьютерное зрение",
    en: "Computer vision",
  },

  "ie.tg.body": {
    kk: "Telegram — жазудың ең жылдам жолы. Контактілерде сілтеме бар.",
    ru: "Telegram — самый быстрый способ написать. Ссылка есть в контактах.",
    en: "Telegram is the fastest way to reach me. The link is in Contacts.",
  },
  "ie.resume.body": {
    kk: "Толық түйіндеме жүйеде PDF түрінде ашылады және жүктеуге болады.",
    ru: "Полное резюме открывается в системе как PDF, его можно скачать.",
    en: "The full resume opens as a PDF inside the system and can be downloaded.",
  },
  "ie.projects.body": {
    kk: "TamirlanOS, CutAI, IRON FORM және басқа жобалар.",
    ru: "TamirlanOS, CutAI, IRON FORM и другие проекты.",
    en: "TamirlanOS, CutAI, IRON FORM and other projects.",
  },
  "ie.gallery.body": {
    kk: "Blender мен Maya-да жасалған 3D жұмыстар.",
    ru: "3D-работы, сделанные в Blender и Maya.",
    en: "3D work made in Blender and Maya.",
  },
  "ie.about.body": {
    kk: "Кәсіби профиль, тәсіл және философия.",
    ru: "Профессиональный профиль, подход и философия.",
    en: "Professional profile, approach and philosophy.",
  },
  "ie.contact.body": {
    kk: "Пошта, Telegram, WhatsApp және әлеуметтік желілер.",
    ru: "Почта, Telegram, WhatsApp и социальные сети.",
    en: "Email, Telegram, WhatsApp and social links.",
  },
  "ie.blog.body": {
    kk: "Әзірге блог жоқ. Идеялар «Идеялар» терезесінде жинақталған.",
    ru: "Блога пока нет. Идеи собраны в окне «Идеи».",
    en: "No blog yet. Ideas live in the Ideas window.",
  },
  "ie.sys32.body": {
    kk: "Жүйелік қалта. Шолғышта «Көрініс» мәзірінен жасырын файлдарды қосыңыз.",
    ru: "Системная папка. Включите скрытые файлы в меню «Вид» проводника.",
    en: "System folder. Enable hidden files from the explorer View menu.",
  },

  "ie.404.title": {
    kk: "Бет көрсетілмейді",
    ru: "Страница не может быть отображена",
    en: "The page cannot be displayed",
  },
  "ie.404.body": {
    kk: "Іздеген бетіңіз қазір қолжетімсіз немесе мүлдем болмаған.",
    ru: "Страница, которую вы ищете, сейчас недоступна или её никогда не было.",
    en: "The page you are looking for is unavailable, or never existed.",
  },
  "ie.404.hint1": {
    kk: "Мекенжайдың дұрыстығын тексеріңіз",
    ru: "Проверьте правильность адреса",
    en: "Check that the address is correct",
  },
  "ie.404.hint2": {
    kk: "Немесе басты бетке оралыңыз",
    ru: "Или вернитесь на домашнюю страницу",
    en: "Or return to the home page",
  },
  "ie.404.cannot": {
    kk: "Табылмады:",
    ru: "Не найдено:",
    en: "Cannot find:",
  },

  "ie.upd.sub": {
    kk: "Жүйені жаңарту қызметі",
    ru: "Служба обновления системы",
    en: "System update service",
  },
  "ie.upd.available": {
    kk: "Қолжетімді жаңартулар",
    ru: "Доступные обновления",
    en: "Available updates",
  },
  "ie.upd.installed": { kk: "орнатылды", ru: "установлено", en: "installed" },
  "ie.upd.pending": {
    kk: "күтілуде",
    ru: "ожидает установки",
    en: "pending",
  },
  "ie.upd.failed": {
    kk: "орнатылмады",
    ru: "не установлено",
    en: "failed to install",
  },
  "ie.upd.note": {
    kk: "Кейбір жаңартулар қайта жүктеуді талап етеді. Ұйқы кестесі — жыл сайын.",
    ru: "Некоторые обновления требуют перезагрузки. Режим сна — ежегодно.",
    en: "Some updates require a restart. Sleep schedule: annually.",
  },

  "ie.secret.title": {
    kk: "> қатынау расталды",
    ru: "> доступ подтверждён",
    en: "> access granted",
  },
  "ie.secret.body": {
    kk: "Мұнда жасырын ештеңе жоқ. Тек мынау: егер сіз мекенжай жолағына «secret» деп тердіңіз, сіз дәл менің жұмысқа алғым келетін адамсыз — қызық және тексеретін.",
    ru: "Здесь нет ничего засекреченного. Только это: если вы набрали «secret» в адресной строке, вы именно тот человек, с которым я хотел бы работать — любопытный и проверяющий.",
    en: "Nothing classified here. Just this: if you typed “secret” into the address bar, you are exactly the kind of person I want to work with — curious, and willing to test.",
  },
  "ie.secret.thanks": {
    kk: "Осында жеткеніңізге рахмет.",
    ru: "Спасибо, что дошли сюда.",
    en: "Thanks for coming this far.",
  },

  "ie.dev.on": {
    kk: "Developer Mode: ҚОСУЛЫ",
    ru: "Developer Mode: ВКЛЮЧЁН",
    en: "Developer Mode: ENABLED",
  },
  "ie.dev.off": {
    kk: "Developer Mode",
    ru: "Developer Mode",
    en: "Developer Mode",
  },
  "ie.dev.apps": { kk: "20+", ru: "20+", en: "20+" },
  "ie.dev.note": {
    kk: "Бұл жүйе қолмен жиналған. Кодты GitHub-та қарауға болады.",
    ru: "Эта система собрана вручную. Код можно посмотреть на GitHub.",
    en: "This system was built by hand. The code is on GitHub.",
  },

  "ie.sec.title": {
    kk: "Қауіпсіздік туралы ескерту",
    ru: "Предупреждение безопасности",
    en: "Security Warning",
  },
  "ie.sec.body": {
    kk: "Сіз TamirlanOS-тан шығып, сыртқы сайтқа өтесіз:",
    ru: "Вы покидаете TamirlanOS и переходите на внешний сайт:",
    en: "You are about to leave TamirlanOS and open an external site:",
  },
  "ie.sec.ask": {
    kk: "Жалғастырасыз ба?",
    ru: "Продолжить?",
    en: "Do you want to continue?",
  },
  "ie.sec.yes": { kk: "Иә", ru: "Да", en: "Yes" },
  "ie.sec.no": { kk: "Жоқ", ru: "Нет", en: "No" },
  "bin.heading": {
    kk: "Аяқталмаған идеялар",
    ru: "Незаконченные идеи",
    en: "Unfinished ideas",
  },
  "bin.intro": {
    kk: "Мұнда шықпаған нәрселер жатыр. Әрқайсысы бірдеңеге үйретті — сондықтан жойылмаған.",
    ru: "Здесь лежит то, что не вышло. Каждая вещь чему-то научила — поэтому она не удалена.",
    en: "Things that did not ship. Each one taught something, so none of them are deleted.",
  },
  "bin.what": { kk: "Не болды", ru: "Что это было", en: "What it was" },
  "bin.why": {
    kk: "Неге тоқтады",
    ru: "Почему остановилось",
    en: "Why it stopped",
  },
  "bin.learned": {
    kk: "Не үйретті",
    ru: "Чему научило",
    en: "What it taught",
  },
  "bin.objects": {
    kk: "Объектілер: {count}",
    ru: "Объектов: {count}",
    en: "{count} objects",
  },
  "bin.kind.project": { kk: "Жоба", ru: "Проект", en: "Project" },
  "bin.kind.logo": { kk: "Логотип", ru: "Логотип", en: "Logo" },
  "bin.kind.prototype": { kk: "Прототип", ru: "Прототип", en: "Prototype" },
  "bin.kind.experiment": {
    kk: "Эксперимент",
    ru: "Эксперимент",
    en: "Experiment",
  },
  "app.file-viewer": {
    kk: "Файлды қарау",
    ru: "Просмотр файла",
    en: "File Viewer",
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

  // Achievements
  "app.achievements": {
    kk: "Жетістіктер",
    ru: "Достижения",
    en: "Achievements",
  },
  "ach.title": { kk: "Жетістіктер", ru: "Достижения", en: "Achievements" },
  "ach.unlocked": {
    kk: "Жетістік ашылды",
    ru: "Достижение получено",
    en: "Achievement unlocked",
  },
  "ach.progress": {
    kk: "{percent}% аяқталды",
    ru: "Выполнено на {percent}%",
    en: "{percent}% complete",
  },
  "ach.hidden": { kk: "Құпия", ru: "Секрет", en: "Secret" },
  "ach.hidden.d": {
    kk: "Әлі ашылмаған",
    ru: "Пока не раскрыто",
    en: "Not discovered yet",
  },

  "ach.first-boot": {
    kk: "Бірінші жүктеу",
    ru: "Первая загрузка",
    en: "First Boot",
  },
  "ach.first-boot.d": {
    kk: "TamirlanOS іске қосылды",
    ru: "Система запущена",
    en: "You booted the system",
  },
  "ach.explorer": { kk: "Зерттеуші", ru: "Исследователь", en: "Explorer" },
  "ach.explorer.d": {
    kk: "5 қосымша ашылды",
    ru: "Открыто 5 приложений",
    en: "Opened 5 applications",
  },
  "ach.power-user": {
    kk: "Тәжірибелі қолданушы",
    ru: "Опытный пользователь",
    en: "Power User",
  },
  "ach.power-user.d": {
    kk: "12 қосымша ашылды",
    ru: "Открыто 12 приложений",
    en: "Opened 12 applications",
  },
  "ach.windows-veteran": {
    kk: "Windows ардагері",
    ru: "Ветеран Windows",
    en: "Windows Veteran",
  },
  "ach.windows-veteran.d": {
    kk: "Барлық қосымша ашылды",
    ru: "Открыты все приложения",
    en: "Opened every application",
  },
  "ach.reader": { kk: "Оқырман", ru: "Читатель", en: "Reader" },
  "ach.reader.d": {
    kk: "«Мен туралы» оқылды",
    ru: "Прочитано «Обо мне»",
    en: "Read the About page",
  },
  "ach.developer": { kk: "Әзірлеуші", ru: "Разработчик", en: "Developer" },
  "ach.developer.d": {
    kk: "Жобалар қаралды",
    ru: "Просмотрены проекты",
    en: "Browsed the projects",
  },
  "ach.recruiter": { kk: "Рекрутер", ru: "Рекрутёр", en: "Recruiter" },
  "ach.recruiter.d": {
    kk: "Түйіндеме ашылды",
    ru: "Открыто резюме",
    en: "Opened the resume",
  },
  "ach.photographer": { kk: "Фотограф", ru: "Фотограф", en: "Photographer" },
  "ach.photographer.d": {
    kk: "Галерея қаралды",
    ru: "Просмотрена галерея",
    en: "Viewed the gallery",
  },
  "ach.networker": { kk: "Байланысшы", ru: "Связной", en: "Networker" },
  "ach.networker.d": {
    kk: "Контактілер табылды",
    ru: "Найдены контакты",
    en: "Found the contacts",
  },
  "ach.ai-researcher": {
    kk: "AI-зерттеуші",
    ru: "ИИ-исследователь",
    en: "AI Researcher",
  },
  "ach.ai-researcher.d": {
    kk: "Агентке хабарлама жазылды",
    ru: "Написано сообщение Агенту",
    en: "Messaged the Agent",
  },
  "ach.gamer": { kk: "Ойыншы", ru: "Геймер", en: "Gamer" },
  "ach.gamer.d": {
    kk: "Кез келген ойын іске қосылды",
    ru: "Запущена любая игра",
    en: "Launched any game",
  },
  "ach.sapper": { kk: "Сапёр", ru: "Сапёр", en: "Sapper" },
  "ach.sapper.d": {
    kk: "Мина іздеу ұтылды",
    ru: "Пройден Сапёр",
    en: "Cleared Minesweeper",
  },
  "ach.grandmaster": {
    kk: "Гроссмейстер",
    ru: "Гроссмейстер",
    en: "Grandmaster",
  },
  "ach.grandmaster.d": {
    kk: "Дойбыда ЖИ жеңілді",
    ru: "ИИ обыгран в шашки",
    en: "Beat the checkers AI",
  },
  "ach.stalemate": { kk: "Тең ойын", ru: "Ничья", en: "Stalemate" },
  "ach.stalemate.d": {
    kk: "Крестики-ноликсте ЖИ-мен тең",
    ru: "Ничья с ИИ в крестиках-ноликах",
    en: "Drew against the tic-tac-toe AI",
  },
  "ach.tile-master": {
    kk: "Плитка шебері",
    ru: "Мастер плиток",
    en: "Tile Master",
  },
  "ach.tile-master.d": {
    kk: "2048-де 512 жиналды",
    ru: "Собрана плитка 512 в 2048",
    en: "Reached the 512 tile",
  },
  "ach.sharpshooter": {
    kk: "Мерген",
    ru: "Меткий стрелок",
    en: "Sharpshooter",
  },
  "ach.sharpshooter.d": {
    kk: "Шутерде 5-толқынға жетті",
    ru: "Достигнута 5-я волна в шутере",
    en: "Survived to wave 5",
  },
  "ach.artist": { kk: "Суретші", ru: "Художник", en: "Artist" },
  "ach.artist.d": {
    kk: "Paint-те сурет салынды",
    ru: "Нарисовано в Paint",
    en: "Drew something in Paint",
  },
  "ach.polyglot": { kk: "Полиглот", ru: "Полиглот", en: "Polyglot" },
  "ach.polyglot.d": {
    kk: "Жүйе тілі ауыстырылды",
    ru: "Сменён язык системы",
    en: "Switched the system language",
  },
  "ach.retro": { kk: "Ретро", ru: "Ретро", en: "Retro" },
  "ach.retro.d": {
    kk: "ЭЛТ эффектісі қосылды",
    ru: "Включён эффект ЭЛТ",
    en: "Turned on the CRT effect",
  },
  "ach.blue-screen": { kk: "Көк экран", ru: "Синий экран", en: "Blue Screen" },
  "ach.blue-screen.d": {
    kk: "Жүйені шыдамнан айырдыңыз",
    ru: "Вы вывели систему из терпения",
    en: "You pushed the system too far",
  },
  "bsod.line1": {
    kk: "TamirlanOS қалыпты жұмысты жалғастыра алмайды.",
    ru: "TamirlanOS не может продолжать нормальную работу.",
    en: "TamirlanOS cannot continue running normally.",
  },
  "bsod.line2": {
    kk: "Себебі: тым көп шыдамсыздық анықталды.",
    ru: "Причина: обнаружено слишком много нетерпения.",
    en: "The problem seems to be caused by excessive impatience.",
  },
  "bsod.line3": {
    kk: "Ештеңе жоғалған жоқ. Бәрі орнында қалады.",
    ru: "Ничего не потеряно. Всё останется на месте.",
    en: "Nothing was lost. Everything stays where it was.",
  },
  "bsod.reboot": {
    kk: "Қайта жүктелуде...",
    ru: "Перезагрузка...",
    en: "Rebooting...",
  },
  "ach.digger": { kk: "Іздеуші", ru: "Копатель", en: "Digger" },
  "ach.digger.d": {
    kk: "Жасырын файл ашылды",
    ru: "Открыт скрытый файл",
    en: "Opened a hidden file",
  },
  "ach.secret-finder": {
    kk: "Құпия іздеуші",
    ru: "Искатель секретов",
    en: "Secret Finder",
  },
  "ach.secret-finder.d": {
    kk: "Konami коды табылды",
    ru: "Найден код Konami",
    en: "Found the Konami code",
  },

  // BIOS / POST
  "bios.memoryTest": {
    kk: "Жады тексерілуде",
    ru: "Проверка памяти",
    en: "Memory Test",
  },
  "bios.startingOs": {
    kk: "TamirlanOS іске қосылуда...",
    ru: "Запуск TamirlanOS...",
    en: "Starting TamirlanOS...",
  },
  "bios.setupHint": {
    kk: "SETUP үшін DEL, жүктеу мәзірі үшін F12. Өткізу үшін кез келген пернені басыңыз.",
    ru: "DEL — SETUP, F12 — меню загрузки. Нажмите любую клавишу, чтобы пропустить.",
    en: "Press DEL to enter SETUP, F12 for Boot Menu. Press any key to skip.",
  },

  // Loading messages
  "load.services": {
    kk: "Қызметтер іске қосылуда...",
    ru: "Запуск служб...",
    en: "Starting services...",
  },
  "load.profile": {
    kk: "Пайдаланушы параметрлері жүктелуде...",
    ru: "Загрузка параметров пользователя...",
    en: "Loading user settings...",
  },
  "load.desktop": {
    kk: "Жұмыс үстелі дайындалуда...",
    ru: "Подготовка рабочего стола...",
    en: "Preparing your desktop...",
  },
  "load.apps": {
    kk: "Қосымшалар тіркелуде...",
    ru: "Регистрация приложений...",
    en: "Registering applications...",
  },
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

  // Agent 5.6 messenger
  "app.agent": { kk: "Агент 5.6", ru: "Агент 5.6", en: "Agent 5.6" },
  "agent.botName": { kk: "Агент 5.6", ru: "Агент 5.6", en: "Agent 5.6" },
  "agent.status": {
    kk: "Тамирлан жобаларға ашық",
    ru: "Тамирлан открыт для проектов",
    en: "Tamirlan is open for work",
  },
  "agent.block": { kk: "Бұғаттау", ru: "Заблокировать", en: "Block" },
  "agent.text": { kk: "Мәтін", ru: "Текст", en: "Text" },
  "agent.help": { kk: "Мәзір", ru: "Меню", en: "Menu" },
  "agent.restart": { kk: "Мұрағат", ru: "Архив", en: "Archive" },
  "agent.profile": { kk: "Анкета", ru: "Анкета", en: "Profile" },
  // Proactive nudges
  "nudge.show": { kk: "Көрсету", ru: "Показать", en: "Show me" },
  "nudge.later": { kk: "Кейін", ru: "Не сейчас", en: "Not now" },
  "nudge.mute": {
    kk: "Кедергі жасамау",
    ru: "Не мешать",
    en: "Do not disturb",
  },
  "nudge.lost": {
    kk: "Неден бастарыңызды білмесеңіз — «Мен туралы» жақсы бастама.",
    ru: "Если не знаете, с чего начать — «Обо мне» хорошая точка входа.",
    en: "Not sure where to start? About Me is a good entry point.",
  },
  "nudge.explainProjects": {
    kk: "Бұл жобалар қалай пайда болғанын хронологиядан көруге болады.",
    ru: "Как эти проекты появились — видно в хронологии. Показать?",
    en: "Want to see how these projects came about? The timeline explains it.",
  },
  "nudge.resume": {
    kk: "Толық түйіндемені де қарауға болады — жүктеп алуға да келеді.",
    ru: "Есть ещё полное резюме — его можно и скачать.",
    en: "There is a full resume too — you can download it.",
  },
  "nudge.shortcuts": {
    kk: "Кеңес: F11 — толық экран. Терезелерді тапсырмалар тақтасынан ауыстырыңыз.",
    ru: "Совет: F11 — полный экран, а окна переключаются через панель задач.",
    en: "Tip: F11 goes fullscreen, and the taskbar switches between windows.",
  },
  "nudge.achievements": {
    kk: "Сіз бірнеше жетістік аштыңыз. Тізімді көресіз бе?",
    ru: "Вы уже открыли несколько достижений. Показать список?",
    en: "You have unlocked a few achievements. Want to see the list?",
  },
  "nudge.hidden": {
    kk: "Шолғышта «Көрініс» мәзірінде жасырын файлдар бар. Тексеріп көріңіз.",
    ru: "В проводнике, в меню «Вид», прячутся скрытые файлы. Стоит заглянуть.",
    en: "The explorer hides files under the View menu. Worth a look.",
  },
  "nudge.recycle": {
    kk: "Себетте аяқталмаған идеялар жатыр — әрқайсысы бірдеңеге үйретті.",
    ru: "В корзине лежат незаконченные идеи — каждая чему-то научила.",
    en: "The recycle bin holds unfinished ideas — each one taught something.",
  },
  "nudge.games": {
    kk: "Демалғыңыз келсе, мұнда бірнеше ойын бар.",
    ru: "Если захочется передохнуть — здесь есть несколько игр.",
    en: "If you fancy a break, there are a few games here.",
  },
  "nudge.contact": {
    kk: "Көп нәрсені көрдіңіз. Сұрақ болса — байланысыңыз.",
    ru: "Вы посмотрели немало. Если появился вопрос — можно написать.",
    en: "You have seen a lot. If a question came up, feel free to reach out.",
  },

  // Quick replies in the messenger
  "quick.projects": { kk: "Жобалар", ru: "Проекты", en: "Projects" },
  "quick.resume": { kk: "Түйіндеме", ru: "Резюме", en: "Resume" },
  "quick.skills": { kk: "Дағдылар", ru: "Навыки", en: "Skills" },
  "quick.contact": { kk: "Байланыс", ru: "Контакты", en: "Contact" },

  "agent.trayHint": {
    kk: "Сәлем! Мен трейде тұрмын — сұрақ қою үшін басыңыз.",
    ru: "Привет! Я живу в трее — нажми, чтобы написать мне.",
    en: "Hi! I live in the tray — click to chat with me.",
  },
  "agent.enlarge": { kk: "Үлкейту", ru: "Увеличить", en: "Enlarge" },
  "agent.changePhoto": {
    kk: "Фотоны ауыстыру",
    ru: "Сменить фото",
    en: "Change photo",
  },
  "agent.sms": { kk: "SMS", ru: "SMS", en: "SMS" },
  "agent.placeholder": {
    kk: "Хабарламаңызды жазыңыз…",
    ru: "Введите сообщение…",
    en: "Type your message…",
  },
  "agent.send": { kk: "Жіберу", ru: "Отправить", en: "Send" },
  "agent.you": { kk: "Сіз", ru: "Вы", en: "You" },
  "agent.typing": {
    kk: "Агент теріп жатыр…",
    ru: "Агент печатает…",
    en: "Agent is typing…",
  },
  "agent.lastMsg": {
    kk: "Соңғы хабарлама {time} алынды",
    ru: "Последнее сообщение получено в {time}",
    en: "Last message received at {time}",
  },
  "agent.msg.greeting": {
    kk: "Сәлем! Мен — Агент 5.6, Тамирланның көмекшісі. Ол жобалар мен фрилансқа ашық.\n\nКоманданы жазып көр:\n• about — мен туралы\n• projects — жобалар\n• resume — түйіндеме\n• contact — байланыс\n\nНемесе жай ғана сұрақ қой :)",
    ru: "Привет! Я — Агент 5.6, помощник Тамирлана. Он открыт для проектов и фриланса.\n\nПопробуй команду:\n• about — обо мне\n• projects — мои проекты\n• resume — резюме\n• contact — связаться\n\nИли просто спроси что-нибудь :)",
    en: "Hi! I'm Agent 5.6, Tamirlan's assistant. He's open for projects and freelance.\n\nTry a command:\n• about — about him\n• projects — my projects\n• resume — resume\n• contact — get in touch\n\nOr just ask me something :)",
  },
  "agent.msg.about": {
    kk: "Тамирлан — әзірлеуші, AI-инженер, 3D-суретші және оқытушы. «Мен туралы» терезесін ашып жатырмын 👇",
    ru: "Тамирлан — разработчик, AI-инженер, 3D-художник и преподаватель. Открываю окно «Обо мне» 👇",
    en: "Tamirlan is a developer, AI engineer, 3D artist and teacher. Opening the About Me window 👇",
  },
  "agent.msg.projects": {
    kk: "TamirlanOS, CutAI, IRON FORM және басқалары. «Жобалар» терезесін ашып жатырмын 👇",
    ru: "TamirlanOS, CutAI, IRON FORM и другое. Открываю окно «Проекты» 👇",
    en: "TamirlanOS, CutAI, IRON FORM and more. Opening the Projects window 👇",
  },
  "agent.msg.resume": {
    kk: "Толық түйіндемені ашып жатырмын — оны жүктеп алуға да болады 👇",
    ru: "Открываю полное резюме — его можно и скачать 👇",
    en: "Opening the full resume — you can download it too 👇",
  },
  "agent.msg.contact": {
    kk: "Тамирланмен байланысу оңай. «Контактілер» терезесін ашып жатырмын 👇",
    ru: "Связаться с Тамирланом легко. Открываю окно «Контакты» 👇",
    en: "Reaching Tamirlan is easy. Opening the Contact window 👇",
  },
  "agent.msg.skills": {
    kk: "Next.js, React, TypeScript, AI/LLM, Blender, Maya… «Дағдылар» терезесін ашып жатырмын 👇",
    ru: "Next.js, React, TypeScript, AI/LLM, Blender, Maya… Открываю окно «Навыки» 👇",
    en: "Next.js, React, TypeScript, AI/LLM, Blender, Maya… Opening the Skills window 👇",
  },
  "agent.msg.hello": {
    kk: "Сәлем! 😊 «projects», «resume» немесе «contact» деп жазып көр.",
    ru: "Привет! 😊 Напиши «projects», «resume» или «contact».",
    en: "Hey there! 😊 Try typing “projects”, “resume” or “contact”.",
  },
  "agent.msg.thanks": {
    kk: "Оқасы жоқ! Тағы бірдеңе керек пе? 🙂",
    ru: "Пожалуйста! Нужно ещё что-нибудь? 🙂",
    en: "You're welcome! Anything else? 🙂",
  },
  "agent.msg.help": {
    kk: "Командалар: about, projects, resume, contact, skills. Жай ғана жазып жібер.",
    ru: "Команды: about, projects, resume, contact, skills. Просто напиши любую.",
    en: "Commands: about, projects, resume, contact, skills. Just type one.",
  },
  "agent.msg.fallback": {
    kk: "Мұны әлі түсінбеймін 🙈 Мына команданы жаз: about, projects, resume, contact.",
    ru: "Пока не понимаю это 🙈 Напиши команду: about, projects, resume, contact.",
    en: "I don't get that yet 🙈 Try a command: about, projects, resume, contact.",
  },
};
