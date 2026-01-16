import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type TabId = 'hero' | 'solutions' | 'advantages' | 'portfolio' | 'certificates' | 'contact' | 'images' | 'users';

interface AdminSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: 'images' as TabId, label: 'Изображения', icon: 'Image' },
    { id: 'hero' as TabId, label: 'Главный экран', icon: 'Home' },
    { id: 'solutions' as TabId, label: 'Решения', icon: 'Lightbulb' },
    { id: 'advantages' as TabId, label: 'Преимущества', icon: 'Award' },
    { id: 'portfolio' as TabId, label: 'Портфолио', icon: 'Briefcase' },
    { id: 'certificates' as TabId, label: 'Сертификаты', icon: 'Shield' },
    { id: 'contact' as TabId, label: 'Контакты', icon: 'Phone' },
    { id: 'users' as TabId, label: 'Пользователи', icon: 'Users' },
  ];

  return (
    <aside className="lg:col-span-1">
      <Card className="p-4 sticky top-24">
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-900 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon name={tab.icon as any} size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
      </Card>
    </aside>
  );
}