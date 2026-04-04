interface Props {
  value: string;
  onChange: (language: string) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="de">Deutsch</option>
      <option value="en">English</option>
    </select>
  );
}
