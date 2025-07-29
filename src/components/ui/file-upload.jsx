import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const FileUpload = React.forwardRef(({ id, label, onFileChange, file: initialFile, required, className, acceptedFileTypes = "image/jpeg,image/png,application/pdf" }, ref) => {
  const [file, setFile] = useState(initialFile || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setFile(initialFile || null);
  }, [initialFile]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileChange) {
        onFileChange(id, selectedFile);
      }
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onFileChange) {
      onFileChange(id, null);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      if (onFileChange) {
        onFileChange(id, droppedFile);
      }
    }
  }, [id, onFileChange]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div
        ref={ref}
        className={cn(
          'mt-1 flex justify-center items-center w-full px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200',
          isDragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
          file ? 'border-green-500' : ''
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          id={id}
          name={id}
          type="file"
          className="sr-only"
          ref={inputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          required={required && !file}
        />
        {file ? (
          <div className="flex items-center space-x-4 text-sm text-foreground">
            <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-semibold truncate max-w-[150px] sm:max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <div className="text-center cursor-pointer">
            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Cliquez pour choisir</span> ou glissez-déposez
            </p>
            <p className="text-xs text-muted-foreground">PDF, PNG, JPG</p>
          </div>
        )}
      </div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export { FileUpload };