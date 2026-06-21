import { useState, useRef } from 'react';
import { clsx } from 'clsx';

const ImageUploader = ({ onFileSelect, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={clsx(
        'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
        isDragging ?
        'border-blue-500 bg-blue-50 dark:bg-blue-500/10' :
        'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700'
      )}>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange} />

      {previewUrl ?
      <>
          <img
          src={previewUrl}
          alt="Vista previa"
          className="absolute inset-0 w-full h-full object-cover rounded-xl" />

          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm font-semibold">Cambiar imagen</span>
          </div>
        </> :

      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-slate-400">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-300 font-bold text-lg">+</div>
          <p className="text-sm font-medium">
            {isDragging ? 'Suelte la imagen aqui' : 'Arrastre una imagen o haga clic'}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500">JPG, PNG o WebP</p>
        </div>
      }
    </div>);

};

export default ImageUploader;
