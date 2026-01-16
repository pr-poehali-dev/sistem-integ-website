// Система управления контентом сайта
export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    title: string;
    description: string;
  };
  solutions: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
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
    socials: {
      vk?: string;
      telegram?: string;
      whatsapp?: string;
    };
  };
}

const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "Комплексная интеграция инженерных систем",
    subtitle: "Инновационные технологии",
    description: "Проектирование, комплектация и монтаж современных систем автоматизации зданий. Полный цикл работ от концепции до пусконаладки.",
  },
  about: {
    title: "О компании",
    description: "Мы специализируемся на комплексных решениях в области интеграции инженерных систем. Наша команда сертифицированных специалистов обеспечивает полный цикл работ от проектирования до технического обслуживания.",
  },
  solutions: {
    title: "Наши решения",
    items: [
      {
        id: "1",
        title: "Пожарная сигнализация",
        description: "Современные адресные и неадресные системы обнаружения возгораний",
        icon: "Bell",
      },
      {
        id: "2",
        title: "Автоматическое пожаротушение",
        description: "Водяные, газовые, порошковые и аэрозольные системы тушения",
        icon: "Droplets",
      },
      {
        id: "3",
        title: "Система оповещения",
        description: "СОУЭ для эвакуации людей при возникновении пожара",
        icon: "Volume2",
      },
      {
        id: "4",
        title: "Дымоудаление",
        description: "Системы противодымной защиты и управления эвакуацией",
        icon: "Wind",
      },
      {
        id: "5",
        title: "Техническое обслуживание",
        description: "Регулярное ТО и ремонт установленных систем",
        icon: "Wrench",
      },
      {
        id: "6",
        title: "Проектирование",
        description: "Разработка проектной документации по пожарной безопасности",
        icon: "FileText",
      },
    ],
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
        title: "Гарантия до 25 лет",
        description: "Полная ответственность за качество работ",
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
        description: "Адресная система сигнализации на 30 этажей",
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
    socials: {
      vk: "https://vk.com/systemcraft",
      telegram: "https://t.me/systemcraft",
      whatsapp: "https://wa.me/73433799888",
    },
  },
};

const STORAGE_KEY = 'site_content';
const PASSWORD_KEY = 'admin_password';

// Инициализация контента
export function initContent() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
  }
  
  // Установка дефолтного пароля (admin)
  const storedPassword = localStorage.getItem(PASSWORD_KEY);
  if (!storedPassword) {
    localStorage.setItem(PASSWORD_KEY, btoa('admin')); // base64 encoded
  }
}

// Получение контента
export function getContent(): SiteContent {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
}

// Сохранение контента
export function saveContent(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  // Генерируем событие для обновления компонентов
  window.dispatchEvent(new CustomEvent('content-updated'));
}

// Проверка пароля
export function checkPassword(password: string): boolean {
  const stored = localStorage.getItem(PASSWORD_KEY);
  return stored === btoa(password);
}

// Смена пароля
export function changePassword(oldPassword: string, newPassword: string): boolean {
  if (!checkPassword(oldPassword)) {
    return false;
  }
  localStorage.setItem(PASSWORD_KEY, btoa(newPassword));
  return true;
}

// Сброс к дефолтному контенту
export function resetContent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
  window.dispatchEvent(new CustomEvent('content-updated'));
}