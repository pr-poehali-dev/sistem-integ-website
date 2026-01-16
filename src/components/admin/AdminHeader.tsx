import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onPasswordChange: () => void;
  onReset: () => void;
  onPreview: () => void;
  onSave: () => void;
  onLogout: () => void;
  userName?: string;
}

export default function AdminHeader({ onPasswordChange, onReset, onPreview, onSave, onLogout, userName }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Управление сайтом</h1>
          {userName && <p className="text-sm text-muted-foreground">Привет, {userName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPasswordChange}>
            <Icon name="Key" size={16} className="mr-2" />
            Сменить пароль
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сбросить
          </Button>
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Icon name="Eye" size={16} className="mr-2" />
            Просмотр
          </Button>
          <Button size="sm" onClick={onSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <Icon name="LogOut" size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}