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
    <div className="mb-4">
      <Label htmlFor={id} required={required}>
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
        className="rounded-md"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
