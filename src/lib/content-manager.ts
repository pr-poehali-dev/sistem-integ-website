// Оптимизированная система управления контентом сайта

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface SiteContent {
  company: {
    name: string;
    legalName: string;
    foundedYear: number;
    tagline: string;
  };
  hero: {
    slides: HeroSlide[];
  };
  solutions: {
    title: string;
    badge: string;
  };
  advantages: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
    stats: Array<{
      id: string;
      value: string;
      label: string;
    }>;
  };
  portfolio: {
    title: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      category: string;
    }>;
  };
  certificates: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      image: string;
    }>;
  };
  contact: {
    title: string;
    phone: string;
    email: string;
    address: string;
    telegram: string;
    socials: {
      vk?: string;
      telegram?: string;
      whatsapp?: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const DEFAULT_CONTENT: SiteContent = {
  company: {
    name: "СистемКрафт",
    legalName: "ООО Компания «Системкрафт»",
    foundedYear: 2009,
    tagline: "Строим системы и сети"
  },
  hero: {
    slides: [
      {
        id: 'sks',
        title: 'СКС',
        subtitle: 'Структурированные кабельные системы',
        description: 'Современная кабельная инфраструктура с гарантией до 25 лет',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920&h=800&fit=crop&q=80'
      },
      {
        id: 'sot',
        title: 'Видеонаблюдение',
        subtitle: 'Система охранного телевидения',
        description: 'IP-камеры 4K с интеллектуальной аналитикой и облачным хранением',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&h=800&fit=crop&q=80'
      },
      {
        id: 'skud',
        title: 'СКУД',
        subtitle: 'Контроль и управление доступом',
        description: 'Биометрия, карты доступа и учет рабочего времени',
        image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1920&h=800&fit=crop&q=80'
      },
      {
        id: 'saps',
        title: 'Пожарная безопасность',
        subtitle: 'САПС и СОУЭ под ключ',
        description: 'Автоматическая пожарная сигнализация и система оповещения',
        image: 'https://images.unsplash.com/photo-1536859975388-c3407e9272b7?w=1920&h=800&fit=crop&q=80'
      },
      {
        id: 'ovik',
        title: 'ОВИК',
        subtitle: 'Климатические системы',
        description: 'Вентиляция, кондиционирование и отопление для комфорта',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=800&fit=crop&q=80'
      }
    ]
  },
  solutions: {
    title: "Инженерные системы под ключ",
    badge: "Системы и сети"
  },
  advantages: {
    title: "Почему выбирают нас",
    items: [
      {
        id: "1",
        title: "Полный цикл работ",
        description: "От проектирования до технического обслуживания",
        icon: "CheckCircle2",
      },
      {
        id: "2",
        title: "Сертифицированные специалисты",
        description: "Команда профессионалов с лицензиями МЧС",
        icon: "Award",
      },
      {
        id: "3",
        title: "Прозрачное ценообразование",
        description: "Точная смета без скрытых платежей",
        icon: "Calculator",
      },
      {
        id: "4",
        title: "Соблюдение сроков",
        description: "Четкое планирование и выполнение в срок",
        icon: "Clock",
      },
      {
        id: "5",
        title: "Гарантия от 2 до 25 лет",
        description: "Гарантия качества на все виды работ в зависимости от типа системы",
        icon: "Shield",
      },
      {
        id: "6",
        title: "Техподдержка 24/7",
        description: "Оперативное реагирование на любые запросы",
        icon: "Headphones",
      },
    ],
    stats: [
      { id: "1", value: "50+", label: "Специалистов в штате" },
      { id: "2", value: "500k+", label: "м² смонтированных систем" },
      { id: "3", value: "200+", label: "Довольных клиентов" },
    ],
  },
  portfolio: {
    title: "Наши проекты",
    projects: [
      {
        id: "1",
        title: "Торговый центр «Мега»",
        description: "Комплексная система пожарной безопасности площадью 45 000 м²",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
        category: "Торговые центры",
      },
      {
        id: "2",
        title: "Производственный комплекс",
        description: "Автоматическая система пожаротушения для складских помещений",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
        category: "Производство",
      },
      {
        id: "3",
        title: "Бизнес-центр «Башня»",
        description: "Адресная система сигнализации на 30 этажов",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        category: "Офисные здания",
      },
    ],
  },
  certificates: {
    title: "Сертификаты и лицензии",
    items: [
      {
        id: "1",
        title: "Лицензия МЧС России",
        image: "https://images.unsplash.com/photo-1554224311-beee1249cd19?w=400&h=600&fit=crop",
      },
      {
        id: "2",
        title: "Сертификат ISO 9001",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop",
      },
      {
        id: "3",
        title: "Допуск СРО",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop",
      },
    ],
  },
  contact: {
    title: "Свяжитесь с нами",
    phone: "+7 (343) 379-98-88",
    email: "info@systemcraft.ru",
    address: "г. Екатеринбург, ул. Крестинского, 46А, офис 702",
    telegram: "https://t.me/systemcraft_ekb",
    socials: {
      telegram: "https://t.me/systemcraft_ekb",
      whatsapp: "https://wa.me/73433799888",
    },
  },
  seo: {
    title: "СистемКрафт — Проектирование и монтаж инженерных систем в Екатеринбурге",
    description: "Комплексная интеграция инженерных систем: СКС, СКУД, пожарная сигнализация, видеонаблюдение. Гарантия от 2 до 25 лет. На рынке с 2009 года.",
    keywords: ["системкрафт", "инженерные системы", "СКС", "СКУД", "САПС", "СОУЭ", "видеонаблюдение", "монтаж систем", "екатеринбург"]
  }
};

const STORAGE_KEY = 'site_content_v2';
const PASSWORD_KEY = 'admin_password';
const VERSION = '2.0';

export function initContent() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
    localStorage.setItem('content_version', VERSION);
  } else {
    const currentVersion = localStorage.getItem('content_version');
    if (currentVersion !== VERSION) {
      migrateContent(stored);
    }
  }
  
  const storedPassword = localStorage.getItem(PASSWORD_KEY);
  if (!storedPassword) {
    localStorage.setItem(PASSWORD_KEY, btoa('admin'));
  }
}

function migrateContent(oldContent: string) {
  try {
    const old = JSON.parse(oldContent);
    const migrated: SiteContent = {
      ...DEFAULT_CONTENT,
      ...old,
      company: DEFAULT_CONTENT.company,
      hero: DEFAULT_CONTENT.hero,
      seo: DEFAULT_CONTENT.seo
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.setItem('content_version', VERSION);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
    localStorage.setItem('content_version', VERSION);
  }
}

export function getContent(): SiteContent {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
}

export function saveContent(content: Partial<SiteContent>) {
  const current = getContent();
  const updated = { ...current, ...content };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('content-updated'));
}

export function updateSection<K extends keyof SiteContent>(
  section: K, 
  data: Partial<SiteContent[K]>
) {
  const content = getContent();
  content[section] = { ...content[section], ...data } as SiteContent[K];
  saveContent(content);
}

export function checkPassword(password: string): boolean {
  const stored = localStorage.getItem(PASSWORD_KEY);
  return stored === btoa(password);
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  if (!checkPassword(oldPassword)) {
    return false;
  }
  localStorage.setItem(PASSWORD_KEY, btoa(newPassword));
  return true;
}

export function resetContent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
  localStorage.setItem('content_version', VERSION);
  window.dispatchEvent(new CustomEvent('content-updated'));
}

export function exportContent(): string {
  return JSON.stringify(getContent(), null, 2);
}

export function importContent(jsonString: string): boolean {
  try {
    const content = JSON.parse(jsonString);
    saveContent(content);
    return true;
  } catch {
    return false;
  }
}
