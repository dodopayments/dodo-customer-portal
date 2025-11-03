/* eslint-disable @next/next/no-img-element */
import React, { type SyntheticEvent, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import { Upload, Trash2, Crop as CropIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import "react-image-crop/dist/ReactCrop.css";
import { useFormContext } from "react-hook-form";

interface ImageUploadProps {
  name: string;
  className?: string;
  required?: boolean;
  aspect?: number;
  maxSizeMB?: number;
  defaultValue?: string;
  label?: string;
  acceptedTypes?: string[];
  onImageDelete?: () => void;
  maxDimension?: number;
}

interface FileWithPreview extends File {
  preview: string;
}

const MAX_DIMENSION = 1920;

const ImageUpload = ({
  name,
  className,
  required,
  aspect = 1,
  maxSizeMB = 3,
  defaultValue,
  label = "Profile Image",
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  onImageDelete,
  maxDimension = MAX_DIMENSION,
}: ImageUploadProps) => {
  const form = useFormContext();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const scaleImage = useCallback(
    (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          let { width, height } = img;
          const maxSize = maxDimension;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                URL.revokeObjectURL(img.src);
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob"));
              }
            },
            file.type,
            0.9,
          );
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      });
    },
    [maxDimension],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        form.setError(name, {
          type: "manual",
          message: `File size must be less than ${maxSizeMB}MB`,
        });
        return;
      }

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        form.setError(name, {
          type: "manual",
          message: "Invalid file type. Please upload a valid image file.",
        });
        return;
      }

      // Scale the image if needed
      const scaledBlob = await scaleImage(file);
      const scaledFile = new File([scaledBlob], file.name, {
        type: file.type,
      });

      const fileWithPreview = Object.assign(scaledFile, {
        preview: URL.createObjectURL(scaledBlob),
      });

      setSelectedFile(fileWithPreview);
      setOpenDialog(true);
    } catch {
      form.setError(name, {
        type: "manual",
        message: "Failed to process image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      if (aspect) {
        const crop = centerAspectCrop(width / 1.1, height / 1.1, aspect);
        setCrop(crop);
      }
    },
    [aspect],
  );

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("No 2d context");
        }

        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY,
        );

        resolve(canvas.toDataURL("image/png", 0.9));
      });
    },
    [],
  );

  const onCropComplete = useCallback(
    async (crop: PixelCrop) => {
      if (imgRef.current && crop.width && crop.height) {
        const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
        setCroppedImageUrl(croppedImageUrl);
      }
    },
    [getCroppedImg],
  );

  const handleImageDelete = useCallback(() => {
    form.setValue(name, null);
    form.setValue("isImageDeleted", true);
    setSelectedFile(null);
    setCroppedImageUrl("");
    setCrop(undefined);
    setSelectedFile(null);

    onImageDelete?.();
  }, [form, name, onImageDelete]);

  const onCrop = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(croppedImageUrl);
      const blob = await res.blob();
      const file = new File([blob], selectedFile?.name || "cropped-image.png", {
        type: "image/png",
      });

      form.setValue(name, file, { shouldValidate: true });
      form.setValue("isImageDeleted", false);
      setOpenDialog(false);
    } catch {
      form.setError(name, {
        type: "manual",
        message: "Failed to process image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [croppedImageUrl, selectedFile, form, name]);

  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ): Crop => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
          height: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  };

  React.useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}{" "}
            {required && <span className="text-red-500 ml-1">*</span>}{" "}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader className="hidden">
                  <DialogTitle>Crop Image</DialogTitle>
                  <DialogDescription>Dialog to crop image</DialogDescription>
                </DialogHeader>
                <DialogContent className="flex flex-col p-0 w-fit max-w-[95vw] max-h-[95vh]">
                  <div className="relative p-4 overflow-auto flex-grow">
                    {loading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => onCropComplete(c)}
                      aspect={aspect}
                      className="max-w-full max-h-[70vh]"
                    >
                      <img
                        ref={imgRef}
                        alt="Crop preview"
                        src={selectedFile?.preview}
                        onLoad={onImageLoad}
                        className="max-w-full max-h-[70vh] object-contain"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "70vh",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </ReactCrop>
                  </div>
                  <DialogFooter className="p-4 border-t">
                    <DialogClose asChild>
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={handleImageDelete}
                        disabled={loading}
                      >
                        <Trash2 className="mr-1.5 size-4" />
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      size="sm"
                      onClick={onCrop}
                      disabled={loading}
                    >
                      <CropIcon className="mr-1.5 size-4" />
                      Crop
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div
                className={cn(
                  "relative w-full min-h-[9rem] border rounded-lg flex flex-col shadow-sm items-center justify-center cursor-pointer transition-colors",
                  "hover:border-2 hover:border-border-brand",
                  field.value || defaultValue
                    ? "border-border-primary"
                    : "border-border-primary",
                )}
              >
                {(field.value || defaultValue) &&
                !form.getValues("isImageDeleted") ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-start p-5">
                      <img
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : defaultValue
                        }
                        alt="Upload preview"
                        className="rounded-lg h-full aspect-square object-cover"
                      />
                      <div className="ml-4 flex-grow">
                        <p className="text-sm text-text-primary truncate max-w-[100px]">
                          {field.value instanceof File
                            ? field.value.name
                            : "Current Image"}
                        </p>
                        {field.value instanceof File && (
                          <p className="text-sm text-text-secondary">
                            {formatFileSize(field.value.size)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleImageDelete}
                      variant="secondary"
                      className="absolute top-2 right-2 p-2 rounded-full"
                      disabled={loading}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept={acceptedTypes.join(",")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      disabled={loading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFileChange(e);
                      }}
                    />
                    <div className="bg-bg-secondary p-3 rounded-full w-fit mb-2">
                      <Upload className="size-6" />
                    </div>
                    <span className="text-xs text-text-secondary">
                      <span className="text-sm font-display text-button-clink">
                        Click to Upload or drag and drop
                      </span>
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      PNG, JPG or WebP (Max. {maxSizeMB}MB)
                    </span>
                    {loading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUpload;
