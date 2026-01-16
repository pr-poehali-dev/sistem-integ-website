import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { 
  getImages, 
  saveImage, 
  deleteImage, 
  searchImages,
  uploadImageToBase64,
  formatFileSize,
  getStorageStats,
  type StoredImage 
} from '@/lib/image-storage';
import { useToast } from '@/hooks/use-toast';

export default function ImageManager() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoredImage['category'] | 'all'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  const { toast } = useToast();

  const loadImages = () => {
    const allImages = getImages();
    let filtered = allImages;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = searchImages(searchQuery);
    }
    
    setImages(filtered);
  };

  useEffect(() => {
    loadImages();
  }, [searchQuery, selectedCategory]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await uploadImageToBase64(file);
        
        saveImage({
          name: file.name,
          url: base64,
          size: file.size,
          category: 'other',
          tags: []
        });
      }
      
      loadImages();
      toast({
        title: 'Успешно загружено',
        description: `Загружено изображений: ${files.length}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить изображение?')) {
      deleteImage(id);
      loadImages();
      toast({
        title: 'Удалено',
        description: 'Изображение удалено из хранилища',
      });
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Скопировано',
      description: 'URL изображения скопирован в буфер обмена',
    });
  };

  const stats = getStorageStats();
  const categories: { value: StoredImage['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'slider', label: 'Слайдер' },
    { value: 'portfolio', label: 'Портфолио' },
    { value: 'certificates', label: 'Сертификаты' },
    { value: 'other', label: 'Другое' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Хранилище изображений</CardTitle>
              <CardDescription>
                Всего: {stats.totalImages} изображений, {stats.totalSizeFormatted}
              </CardDescription>
            </div>
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label htmlFor="file-upload">
                <Button asChild disabled={isUploading}>
                  <span className="cursor-pointer">
                    {isUploading ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Icon name="Upload" className="mr-2" size={16} />
                        Загрузить изображения
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по названию или тегам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                    {cat.value !== 'all' && stats.byCategory[cat.value] && (
                      <Badge variant="secondary" className="ml-2">
                        {stats.byCategory[cat.value]}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Image" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет изображений</p>
                <p className="text-sm">Загрузите первое изображение</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-square bg-muted relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id);
                          }}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{image.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedImage.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Размер</p>
                  <p className="font-medium">{formatFileSize(selectedImage.size)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Категория</p>
                  <p className="font-medium">{selectedImage.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-2">URL изображения</p>
                  <div className="flex gap-2">
                    <Input
                      value={selectedImage.url}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCopyUrl(selectedImage.url)}
                    >
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
