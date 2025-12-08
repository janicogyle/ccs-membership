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
  labelClassName = '',
}) {
  const resolvedLabelClass = labelClassName || 'text-orange-200';

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        required={required}
        className={`block text-left text-sm font-semibold ${resolvedLabelClass}`}
      >
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
        <p className="text-xs font-medium text-red-400 text-left">{error}</p>
      )}
    </div>
  );
}
