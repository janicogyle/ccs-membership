'use client';

import { Input, Label } from '@/components/atoms';

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
}) {
  return (
    <div>
      <Label htmlFor={id} required={required} className="mb-1.5 block text-left">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full text-left"
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 text-left">{error}</p>
      )}
    </div>
  );
}
