export default function Switch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label>
      {label}
      <input type='checkbox' checked={value} onChange={e => onChange(e.target.checked)} />
    </label>
  );
}
