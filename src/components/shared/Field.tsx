type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
}

export function Field({ label, value, onChange, multiline = false, type = 'text' }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}
