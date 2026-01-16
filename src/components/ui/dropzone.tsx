import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  className?: string;
}

export default function Dropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  maxSize = 10 * 1024 * 1024,
  className
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize) {
        return false;
      }
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }
  }, [disabled, accept, multiple, maxSize, onFilesSelected]);

  const handleClick = () => {
    if (disabled) return;
    document.getElementById('dropzone-file-input')?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id="dropzone-file-input"
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center transition-all',
            isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon name={isDragging ? 'Download' : 'Upload'} size={32} />
        </div>

        <div>
          <p className="text-lg font-medium">
            {isDragging ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            или нажмите для выбора файлов
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground mt-2">
              Максимальный размер файла: {(maxSize / 1024 / 1024).toFixed(0)} МБ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
