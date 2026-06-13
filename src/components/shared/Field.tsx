import { useId } from 'react'

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
  placeholder?: string
  id?: string
}

export function Field({ label, value, onChange, multiline = false, type = 'text', placeholder, id }: FieldProps) {
  const fallbackId = useId()
  const fieldId = id ?? fallbackId

  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  )
}
