import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLoginSuccess: (userId: string, userName: string, userRole: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { loginUser } = await import('@/lib/user-manager');
    const user = loginUser(email, password);

    if (user) {
      onLoginSuccess(user.id, user.name, user.role);
      toast({
        title: 'Добро пожаловать!',
        description: `Вы вошли как ${user.name}`
      });
    } else {
      setError('Неверный email или пароль');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Заполните все поля');
      return;
    }

    const { createUser } = await import('@/lib/user-manager');
    const user = createUser(email, password, name, 'editor');

    if (user) {
      toast({
        title: 'Регистрация успешна!',
        description: 'Теперь вы можете войти в систему'
      });
      setMode('login');
      setName('');
      setPassword('');
    } else {
      setError('Пользователь с таким email уже существует');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Введите email');
      return;
    }

    const { generatePasswordResetToken } = await import('@/lib/user-manager');
    const token = generatePasswordResetToken(email);

    if (token) {
      const resetLink = `${window.location.origin}/reset-password?token=${token}`;
      
      try {
        const response = await fetch('https://functions.poehali.dev/c59964d9-2255-42f3-93ce-55264ab2dfdb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: 'Восстановление пароля - СистемКрафт',
            html: `
              <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #ff6b35;">Восстановление пароля</h2>
                  <p>Вы запросили сброс пароля для доступа к админ-панели сайта СистемКрафт.</p>
                  <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      Сбросить пароль
                    </a>
                  </div>
                  <p style="color: #666; font-size: 14px;">Или скопируйте ссылку в браузер:</p>
                  <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
                    ${resetLink}
                  </p>
                  <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Ссылка действительна в течение 1 часа.<br>
                    Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
                  </p>
                </div>
              </body>
              </html>
            `,
            text: `Восстановление пароля\n\nВы запросили сброс пароля для админ-панели СистемКрафт.\n\nПерейдите по ссылке для создания нового пароля:\n${resetLink}\n\nСсылка действительна в течение 1 часа.\nЕсли вы не запрашивали сброс пароля, просто проигнорируйте это письмо.`
          })
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: 'Письмо отправлено!',
            description: `Ссылка для сброса пароля отправлена на ${email}`
          });
          setMode('login');
        } else {
          throw new Error(result.error || 'Ошибка отправки email');
        }
      } catch (err) {
        const resetLinkFallback = `${window.location.origin}/reset-password?token=${token}`;
        navigator.clipboard.writeText(resetLinkFallback);
        
        toast({
          title: 'Не удалось отправить email',
          description: 'Ссылка скопирована в буфер обмена. Отправьте её вручную.',
          duration: 10000
        });
        
        alert(`Не удалось отправить email автоматически.\n\nСсылка скопирована в буфер обмена:\n\n${resetLinkFallback}\n\nОтправьте её на email: ${email}\n\nПроверьте настройки SMTP (SMTP_USER и SMTP_PASSWORD) в секретах проекта.`);
      }
    } else {
      setError('Пользователь с таким email не найден');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Icon name="Lock" size={32} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' && 'Вход в админ-панель'}
            {mode === 'register' && 'Регистрация'}
            {mode === 'reset' && 'Восстановление пароля'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' && 'Войдите в систему управления сайтом'}
            {mode === 'register' && 'Создайте новый аккаунт'}
            {mode === 'reset' && 'Получите ссылку для сброса пароля'}
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="admin@systemcraft.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Войти
            </Button>
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-orange-600 hover:underline"
              >
                Регистрация
              </button>
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-orange-600 hover:underline"
              >
                Забыли пароль?
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              По умолчанию: admin@systemcraft.ru / admin
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-sm text-orange-600 hover:underline w-full text-center"
            >
              Уже есть аккаунт? Войти
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Получить ссылку
            </Button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-sm text-orange-600 hover:underline w-full text-center"
            >
              Вернуться к входу
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Ссылка будет скопирована в буфер обмена
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}