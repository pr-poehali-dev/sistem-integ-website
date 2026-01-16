// Система управления изображениями

export interface StoredImage {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: number;
  category: 'slider' | 'portfolio' | 'certificates' | 'other';
  tags: string[];
}

const STORAGE_KEY = 'image_storage';

export function getImages(): StoredImage[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveImage(image: Omit<StoredImage, 'id' | 'uploadedAt'>): StoredImage {
  const images = getImages();
  const newImage: StoredImage = {
    ...image,
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uploadedAt: Date.now()
  };
  images.unshift(newImage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  return newImage;
}

export function deleteImage(id: string): boolean {
  const images = getImages();
  const filtered = images.filter(img => img.id !== id);
  if (filtered.length === images.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function updateImage(id: string, updates: Partial<Omit<StoredImage, 'id' | 'uploadedAt'>>): boolean {
  const images = getImages();
  const index = images.findIndex(img => img.id === id);
  if (index === -1) return false;
  images[index] = { ...images[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  return true;
}

export function getImagesByCategory(category: StoredImage['category']): StoredImage[] {
  return getImages().filter(img => img.category === category);
}

export function searchImages(query: string): StoredImage[] {
  const lowerQuery = query.toLowerCase();
  return getImages().filter(img => 
    img.name.toLowerCase().includes(lowerQuery) ||
    img.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function uploadImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Размер файла не должен превышать 10 МБ'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getStorageStats() {
  const images = getImages();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const categories = images.reduce((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalImages: images.length,
    totalSize,
    totalSizeFormatted: formatFileSize(totalSize),
    byCategory: categories
  };
}
