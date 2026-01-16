import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface PasswordChangeModalProps {
  oldPassword: string;
  newPassword: string;
  onOldPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PasswordChangeModal({
  oldPassword,
  newPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onSubmit,
  onCancel,
}: PasswordChangeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Смена пароля</h2>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Текущий пароль"
            value={oldPassword}
            onChange={(e) => onOldPasswordChange(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              Изменить
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Отмена
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
