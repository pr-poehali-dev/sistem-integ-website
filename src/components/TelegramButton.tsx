import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { getContent } from '@/lib/content-manager';

export default function TelegramButton() {
  const [telegramUrl, setTelegramUrl] = useState(getContent().contact.telegram);

  useEffect(() => {
    const handleUpdate = () => setTelegramUrl(getContent().contact.telegram);
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  const handleTelegramClick = () => {
    window.open(telegramUrl, '_blank');
  };

  return (
    <Button
      onClick={handleTelegramClick}
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-[#0088cc] hover:bg-[#0088cc]/90"
      aria-label="Написать в Telegram"
    >
      <Icon name="Send" size={24} className="text-white" />
    </Button>
  );
}