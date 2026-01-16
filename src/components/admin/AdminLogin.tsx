import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminLoginProps {
  password: string;
  error: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminLogin({ password, error, onPasswordChange, onSubmit }: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Icon name="Lock" size={32} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
          <p className="text-gray-600 mt-2">Введите пароль для доступа</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            По умолчанию пароль: admin
          </p>
        </form>
      </Card>
    </div>
  );
}
