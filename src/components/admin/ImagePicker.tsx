import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { getImages, getImagesByCategory, uploadImageToBase64, saveImage, deleteImage, type StoredImage } from '@/lib/image-storage';
import { useToast } from '@/hooks/use-toast';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  category?: StoredImage['category'];
  label?: string;
}

export default function ImagePicker({ value, onChange, category, label = "Изображение" }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<StoredImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, [category]);

  const loadImages = () => {
    const allImages = category ? getImagesByCategory(category) : getImages();
    setImages(allImages);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const allImages = category ? getImagesByCategory(category) : getImages();
    if (query.trim()) {
      const filtered = allImages.filter(img =>
        img.name.toLowerCase().includes(query.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setImages(filtered);
    } else {
      setImages(allImages);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64 = await uploadImageToBase64(file);
        saveImage({
          name: file.name,
          url: base64,
          size: file.size,
          category: category || 'other',
          tags: []
        });
        successCount++;
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: error instanceof Error ? error.message : 'Не удалось загрузить изображение',
          variant: 'destructive'
        });
      }
    }

    setIsUploading(false);
    loadImages();

    if (successCount > 0) {
      toast({
        title: 'Успешно',
        description: `Загружено ${successCount} изображений`
      });
    }

    e.target.value = '';
  };

  const handleSelectImage = (url: string) => {
    onChange(url);
    setIsOpen(false);
    toast({
      title: 'Изображение выбрано',
      description: 'Изображение успешно применено'
    });
  };

  const handleUrlInput = (url: string) => {
    onChange(url);
  };

  const handleDeleteImage = async (e: React.MouseEvent, imageId: string, imageUrl: string) => {
    e.stopPropagation();
    
    if (!confirm('Удалить это изображение из галереи?')) {
      return;
    }

    setDeletingId(imageId);
    
    const success = deleteImage(imageId);
    
    if (success) {
      if (value === imageUrl) {
        onChange('');
      }
      loadImages();
      toast({
        title: 'Удалено',
        description: 'Изображение удалено из галереи'
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить изображение',
        variant: 'destructive'
      });
    }
    
    setDeletingId(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="URL изображения или выберите из галереи"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name="Image" size={16} className="mr-2" />
          Галерея
        </Button>
      </div>

      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isOpen && (
        <Card className="p-4 space-y-4 border-2 border-primary/20">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Поиск по имени или тегам..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
            <div>
              <input
                id="image-picker-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                disabled={isUploading}
                onClick={() => document.getElementById('image-picker-upload')?.click()}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                {isUploading ? 'Загрузка...' : 'Загрузить'}
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {images.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="ImageOff" size={48} className="mx-auto mb-2 opacity-20" />
                <p>Нет изображений</p>
                <p className="text-sm">Загрузите изображения для использования</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectImage(image.url)}
                      className="w-full h-full"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Check" size={24} className="text-white" />
                      </div>
                    </button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleDeleteImage(e, image.id, image.url)}
                      disabled={deletingId === image.id}
                      className="absolute top-1 right-1 w-7 h-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}