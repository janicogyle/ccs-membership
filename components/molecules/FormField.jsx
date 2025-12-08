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
      <Label htmlFor={id} required={required} className="text-center">
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
        className="text-center"
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
