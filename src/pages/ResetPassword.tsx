import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { verifyResetToken, resetPassword } from '@/lib/user-manager';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      const userId = verifyResetToken(urlToken);
      setIsValidToken(!!userId);
    } else {
      setIsValidToken(false);
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть не менее 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    const success = resetPassword(token, newPassword);

    if (success) {
      toast({
        title: 'Успешно',
        description: 'Пароль успешно изменен'
      });
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сбросить пароль. Токен недействителен или истек.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Icon name="Loader" size={48} className="mx-auto mb-4 animate-spin text-orange-600" />
          <p>Проверка токена...</p>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Недействительная ссылка</h1>
            <p className="text-gray-600">
              Ссылка для сброса пароля недействительна или истекла.
            </p>
          </div>
          <Button onClick={() => navigate('/admin')} className="w-full">
            Вернуться к входу
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Icon name="Key" size={32} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Новый пароль</h1>
          <p className="text-gray-600 mt-2">Введите новый пароль для вашего аккаунта</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Новый пароль</label>
            <Input
              type="password"
              placeholder="Минимум 6 символов"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Сохранить пароль
          </Button>
        </form>
      </Card>
    </div>
  );
}
