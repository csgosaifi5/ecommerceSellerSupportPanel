import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, X } from "lucide-react";
import React, { useState, ChangeEvent } from "react";

import {
  ArrayPath,
  Control,
  FieldPath,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, fileToBase64 } from "@/lib/utils";


function FormImageUploader<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  label = "Upload Image",
  className,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  name: ArrayPath<TFieldValues>;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { getFieldState } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const error = getFieldState(name).error?.root;

  const { append, remove, fields } = useFieldArray<any>({
    control,
    name,
  });
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);

    const updatedSelectedFiles = [...selectedFiles, ...newFiles]; // Limit to 3 files

    setSelectedFiles(updatedSelectedFiles);

    handleUpload(updatedSelectedFiles);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setLoading(true);

    //remove all existing images

    fields.forEach((_, index) => {
      remove(index);
    });

    try {
      const uploadPromises = files.map(async (file) => {
        const slugifiedName = file.name.replace(/\s/g, "-").toLowerCase();

        const image_url = await fileToBase64(file);
        append({ image_url, name: slugifiedName });
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {label && (
          <FormLabel className={cn("block")} htmlFor={name}>
            {label}
          </FormLabel>
        )}
      </div>
      <div className="flex  py-2  mb-4 gap-6 flex-wrap">
        <label className={cn("w-14 cursor-pointer flex justify-center  items-center h-14 border rounded-xl",props.disabled?"cursor-not-allowed opacity-80":"")}>
          <Plus size={24} className="text-gray-500" />
          <Input
            type="file"
            className="invisible absolute "
            disabled={loading||props.disabled}
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {fields.map((previewUrl: any, index) => (
          <FormField
            key={index}
            control={control}
            name={`${name}.${index}` as Path<TFieldValues>}
            render={() => (
              <FormItem className="w-14 h-14 border rounded-xl">
                <div key={index} className="relative">
                  <img
                    src={previewUrl.image_url}
                    alt={`Preview ${JSON.stringify(previewUrl) + 1}`}
                    className={cn(
                      "w-14 h-14 rounded-sm",
                      loading ? "opacity-50 grayscale-0" : ""
                    )}
                  />
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      {error && (
        <span className="text-red-500 mt-4 block text-sm font-semibold">
          {error?.message}
        </span>
      )}
    </div>
  );
}

export default FormImageUploader;
