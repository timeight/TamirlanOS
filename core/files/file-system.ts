import { AppKey } from "@/core/apps/app-catalog";
import { HIDDEN_FILES } from "@/core/files/hidden-files";
import type { AppId } from "@/types/application";

export type FileAction =
  { type: "text"; body: readonly string[] } | { type: "app"; appId: AppId };

export interface FileNode {
  kind: "file";
  id: string;
  name: string;
  ext: "txt" | "doc" | "pdf" | "jpg" | "exe" | "sys" | "log" | "dll";
  size: string;
  modified: string;
  hidden?: boolean;
  action: FileAction;
}

export interface FolderNode {
  kind: "folder";
  name: string;
  children: readonly FsNode[];
}

export type FsNode = FolderNode | FileNode;

const doc = (
  id: string,
  name: string,
  ext: FileNode["ext"],
  size: string,
  modified: string,
  body: readonly string[],
): FileNode => ({
  kind: "file",
  id,
  name,
  ext,
  size,
  modified,
  action: { type: "text", body },
});

const shortcut = (
  id: string,
  name: string,
  ext: FileNode["ext"],
  size: string,
  modified: string,
  appId: AppId,
): FileNode => ({
  kind: "file",
  id,
  name,
  ext,
  size,
  modified,
  action: { type: "app", appId },
});

const HIDDEN_NODES: readonly FileNode[] = HIDDEN_FILES.map((file) => ({
  kind: "file" as const,
  id: file.id,
  name: file.name,
  ext: file.kind === "sys" ? "sys" : file.kind === "exe" ? "exe" : file.kind,
  size: file.size,
  modified: file.modified,
  hidden: true,
  action: { type: "text" as const, body: file.body },
}));

export const FILE_SYSTEM: FolderNode = {
  kind: "folder",
  name: "C:",
  children: [
    {
      kind: "folder",
      name: "Desktop",
      children: [
        shortcut(
          "d-about",
          "about_me.lnk",
          "exe",
          "1 КБ",
          "31.07.2026 02:10",
          AppKey.AboutMe,
        ),
        shortcut(
          "d-projects",
          "projects.lnk",
          "exe",
          "1 КБ",
          "31.07.2026 02:10",
          AppKey.Projects,
        ),
        shortcut(
          "d-photo",
          "photography.lnk",
          "exe",
          "1 КБ",
          "28.07.2026 19:40",
          AppKey.Photography,
        ),
        doc(
          "d-readme",
          "read_me_first.txt",
          "txt",
          "1 КБ",
          "31.07.2026 03:20",
          [
            "Привет.",
            "",
            "Ты сейчас в файловой системе моего портфолио.",
            "Здесь всё настоящее в том смысле, что каждый файл",
            "что-то значит. Пустых заглушек нет.",
            "",
            "Начни с Documents — там резюме и хронология.",
            "Если любопытно, загляни в System32 и включи",
            "показ скрытых файлов в меню «Вид».",
          ],
        ),
      ],
    },
    {
      kind: "folder",
      name: "Documents",
      children: [
        shortcut(
          "doc-resume",
          "resume.pdf",
          "pdf",
          "480 КБ",
          "25.07.2026 14:02",
          AppKey.Resume,
        ),
        shortcut(
          "doc-timeline",
          "career_timeline.txt",
          "txt",
          "6 КБ",
          "30.07.2026 21:15",
          AppKey.Timeline,
        ),
        doc(
          "doc-startup",
          "startup_ideas.doc",
          "doc",
          "18 КБ",
          "12.07.2026 23:48",
          [
            "ИДЕИ, КОТОРЫЕ ЖИВУТ В ЗАМЕТКАХ",
            "==============================",
            "",
            "1. CutAI — AI-процессы для создателей контента.",
            "   Статус: в работе. Самая живая из всех.",
            "",
            "2. IRON FORM — тренер, который следит за техникой",
            "   через камеру. Статус: прототип, метит в iOS.",
            "",
            "3. Инструмент для преподавателей: генерация заданий",
            "   под уровень конкретного студента.",
            "   Статус: идея. Проверить спросом, а не кодом.",
            "",
            "4. Плагин к Blender: раскладка UV по описанию словами.",
            "   Статус: идея. Возможно, никогда.",
            "",
            "Правило: не начинать пятую, пока первая не дошла до людей.",
          ],
        ),
        doc(
          "doc-teaching",
          "teaching_notes.txt",
          "txt",
          "4 КБ",
          "18.06.2026 09:30",
          [
            "ЗАМЕТКИ ПРЕПОДАВАТЕЛЯ",
            "=====================",
            "",
            "Что работает со студентами:",
            "",
            "— Показывать свой экран с ошибками, а не готовый код.",
            "  Они должны видеть, что ошибаются все.",
            "",
            "— Один живой проект вместо десяти абстрактных задач.",
            "",
            "— Дедлайн важнее оценки. Сдать работающее в срок",
            "  ценнее, чем идеальное потом.",
            "",
            "Чему научили меня они:",
            "объяснять просто может только тот, кто понял глубоко.",
          ],
        ),
      ],
    },
    {
      kind: "folder",
      name: "Downloads",
      children: [
        doc(
          "dl-blender",
          "blender_installer.exe",
          "exe",
          "312 МБ",
          "04.02.2020 18:22",
          [
            "blender_installer.exe",
            "",
            "Файл, с которого всё началось в 2020 году.",
            "Скачал вечером, чтобы «посмотреть, что это такое».",
            "Первый рендер вышел через три дня и был ужасен.",
            "",
            "Через шесть лет Blender всё ещё стоит на машине.",
            "Некоторые загрузки меняют траекторию.",
          ],
        ),
        doc(
          "dl-course",
          "course_part1_of_12.mp4",
          "exe",
          "1,2 ГБ",
          "09.09.2022 01:14",
          [
            "course_part1_of_12.mp4",
            "",
            "Курс, из которого я посмотрел одну часть из двенадцати.",
            "",
            "Не потому что плохой — потому что на середине первой",
            "части захотелось открыть редактор и попробовать самому.",
            "Так и не вернулся.",
            "",
            "Вывод: я учусь руками, а не просмотром. Полезно знать",
            "о себе такое до того, как купишь двенадцатый курс.",
          ],
        ),
        doc("dl-fonts", "fonts_pack.zip", "exe", "84 МБ", "17.03.2024 12:05", [
          "fonts_pack.zip",
          "",
          "Четыреста шрифтов, из которых я использую четыре.",
          "",
          "Inter, Tahoma, Trebuchet MS и один моноширинный.",
          "Остальные ждут проекта, которого не будет.",
          "",
          "Ограничения экономят больше времени, чем выбор.",
        ]),
      ],
    },
    {
      kind: "folder",
      name: "Pictures",
      children: [
        doc(
          "pic-camera",
          "first_camera.jpg",
          "jpg",
          "2,4 МБ",
          "06.05.2019 17:41",
          [
            "first_camera.jpg",
            "",
            "Fujifilm X-T2 с объективом XF 35mm F2.",
            "Первая камера, купленная на свои.",
            "",
            "Первые полгода я снимал всё подряд и всё было плохо.",
            "Потом понял, что дело не в камере и не в настройках,",
            "а в том, чтобы ждать. Свет, момент, выражение лица.",
            "",
            "Фотография научила терпению, которого не хватало в коде.",
            "Теперь я так же жду, пока идея дозреет, вместо того",
            "чтобы бросаться писать в первый же вечер.",
          ],
        ),
        shortcut(
          "pic-gallery",
          "gallery.lnk",
          "exe",
          "1 КБ",
          "28.07.2026 19:40",
          AppKey.Photography,
        ),
        shortcut(
          "pic-renders",
          "renders_3d.lnk",
          "exe",
          "1 КБ",
          "28.07.2026 19:40",
          AppKey.Gallery3D,
        ),
        doc(
          "pic-wallpaper",
          "bliss_tamirlan.png",
          "jpg",
          "4,1 МБ",
          "20.07.2026 16:30",
          [
            "bliss_tamirlan.png",
            "",
            "Обои этой системы. Зелёный холм с моим именем,",
            "выстриженным в траве.",
            "",
            "Сделаны как оммаж стандартным обоям Windows XP —",
            "картинке, которую видело больше людей, чем любую",
            "другую фотографию в истории.",
            "",
            "Хорошая работа становится фоном чужой жизни.",
          ],
        ),
      ],
    },
    {
      kind: "folder",
      name: "Program Files",
      children: [
        doc("pf-blender", "Blender", "dll", "3,2 ГБ", "с 2020", [
          "Blender Foundation\\Blender",
          "",
          "Установлен в 2020. Основной пакет.",
          "Hard surface, продуктовая визуализация, свет, рендер.",
          "",
          "Здесь я научился думать объёмом, а не плоскостью —",
          "и это до сих пор помогает в интерфейсах.",
        ]),
        doc("pf-maya", "Autodesk Maya", "dll", "5,8 ГБ", "с 2021", [
          "Autodesk\\Maya",
          "",
          "Анимация и работа с риггингом.",
          "Пришёл к нему после Blender, чтобы понять индустриальный",
          "стандарт изнутри. Интерфейс сложнее, логика — та же.",
        ]),
        doc("pf-vscode", "Visual Studio Code", "dll", "620 МБ", "с 2020", [
          "Microsoft\\Visual Studio Code",
          "",
          "Открыт дольше, чем любое другое окно.",
          "Здесь написан этот сайт — каждая строчка вручную.",
        ]),
        doc("pf-davinci", "DaVinci Resolve", "dll", "4,4 ГБ", "с 2020", [
          "Blackmagic Design\\DaVinci Resolve",
          "",
          "Монтаж, цветокоррекция, подкасты, коммерческое видео.",
          "",
          "Цветокоррекция научила видеть полутона —",
          "в буквальном и переносном смысле.",
        ]),
        doc("pf-figma", "Figma", "dll", "180 МБ", "с 2021", [
          "Figma",
          "",
          "Интерфейсы, макеты, дизайн-система.",
          "Правило: если макет нельзя объяснить за минуту,",
          "он слишком сложный.",
        ]),
      ],
    },
    {
      kind: "folder",
      name: "Users",
      children: [
        doc("u-tamirlan", "Tamirlan", "dll", "—", "с 2020", [
          "C:\\Users\\Tamirlan",
          "",
          "Учётная запись: Тамирлан",
          "Тип: администратор",
          "Расположение: Казахстан",
          "Роль: разработчик, AI-инженер, преподаватель",
          "",
          "Профиль загружается с 2020 года. Обновлений много,",
          "переустановок не было.",
        ]),
        doc("u-guest", "Guest", "dll", "—", "сегодня", [
          "C:\\Users\\Guest",
          "",
          "Это вы.",
          "",
          "Права: полный доступ ко всему, что здесь есть.",
          "Ограничений нет — смотрите что угодно.",
          "",
          "Если что-то понравится или появится вопрос,",
          "в системе есть Контакты и Агент 5.6.",
        ]),
      ],
    },
    {
      kind: "folder",
      name: "System32",
      children: [
        doc("sys-drivers", "drivers.txt", "txt", "2 КБ", "31.07.2026 03:02", [
          "УСТАНОВЛЕННЫЕ ДРАЙВЕРЫ",
          "======================",
          "",
          "curiosity.sys ........ OK  (основной)",
          "patience.sys ......... OK  (установлен фотографией, 2019)",
          "discipline.sys ....... OK  (установлен 3D, 2020)",
          "teaching.sys ......... OK  (2023)",
          "perfectionism.sys .... предупреждение: высокая нагрузка",
          "",
          "Последний иногда мешает выпускать вовремя.",
          "Работаю над этим.",
        ]),
        doc("sys-kernel", "kernel.log", "log", "9 КБ", "31.07.2026 03:14", [
          "[2020] Первый рендер. Процесс запущен.",
          "[2021] Подключён модуль фриланса.",
          "[2022] Попытка собрать игровой движок. Прервано.",
          "[2023] Установлены модули ИИ и преподавания.",
          "[2025] MCP, агенты, компьютерное зрение.",
          "[2026] Собрана эта система.",
          "",
          "Uptime: 6 лет. Аварийных остановок не зафиксировано.",
        ]),
        ...HIDDEN_NODES,
      ],
    },
  ],
};

export function resolvePath(path: readonly string[]): FolderNode | null {
  let node: FolderNode = FILE_SYSTEM;
  for (const segment of path) {
    const next = node.children.find(
      (child): child is FolderNode =>
        child.kind === "folder" && child.name === segment,
    );
    if (!next) return null;
    node = next;
  }
  return node;
}

export function findFile(id: string): FileNode | null {
  const walk = (folder: FolderNode): FileNode | null => {
    for (const child of folder.children) {
      if (child.kind === "file" && child.id === id) return child;
      if (child.kind === "folder") {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(FILE_SYSTEM);
}
