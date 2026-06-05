'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, ImagePlus } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { createProduct, updateProduct, uploadProductImage } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    productId?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    verticalMetadata?: Record<string, string | number | boolean>;
  };
}

export default function ProductForm({ mode, initialData }: ProductFormProps) {
  const { user } = useAuth();
  const { workspace, verticalConfig } = useBusinessVertical();
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [verticalMetadata, setVerticalMetadata] = useState<Record<string, string | number | boolean>>(
    initialData?.verticalMetadata || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMetadataChange = (fieldName: string, value: string) => {
    setVerticalMetadata((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !workspace) return;

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = initialData?.imageUrl || '';

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, workspace.workspaceId);
      }

      if (mode === 'create') {
        const productId = await createProduct(workspace.workspaceId, user.uid, {
          name,
          description,
          imageUrl,
          verticalMetadata,
        });
        toast.success(`${verticalConfig.productLabels.singular} created!`);
        router.push('/products');
      } else if (mode === 'edit' && initialData?.productId) {
        await updateProduct(initialData.productId, {
          name,
          description,
          imageUrl,
          verticalMetadata,
        });
        toast.success(`${verticalConfig.productLabels.singular} updated!`);
        router.push('/products');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Image
        </label>
        {imagePreview ? (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-border group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview('');
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-colors bg-gray-50 dark:bg-dark-surface">
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-brand-600 dark:text-brand-400">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG up to 5MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Dynamic Vertical Fields */}
      {verticalConfig.productFormFields.map((field) => {
        if (field.name === 'name' || field.name === 'description') return null; // Handled separately

        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' && field.options ? (
              <select
                value={(verticalMetadata[field.name] as string) || ''}
                onChange={(e) => handleMetadataChange(field.name, e.target.value)}
                className="input-field"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={(verticalMetadata[field.name] as string) || ''}
                onChange={(e) => handleMetadataChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="input-field min-h-[100px] resize-none"
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                value={(verticalMetadata[field.name] as string) || ''}
                onChange={(e) => handleMetadataChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="input-field"
                required={field.required}
              />
            )}
          </div>
        );
      })}

      {/* Name Field (Universal) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {verticalConfig.productFormFields.find(f => f.name === 'name')?.label || 'Name'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={verticalConfig.productFormFields.find(f => f.name === 'name')?.placeholder || 'Enter name'}
          className="input-field"
          required
        />
      </div>

      {/* Description Field (Universal) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {verticalConfig.productFormFields.find(f => f.name === 'description')?.label || 'Description'}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={verticalConfig.productFormFields.find(f => f.name === 'description')?.placeholder || 'Describe the product'}
          className="input-field min-h-[100px] resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {mode === 'create' ? `Create ${verticalConfig.productLabels.singular}` : `Update ${verticalConfig.productLabels.singular}`}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}