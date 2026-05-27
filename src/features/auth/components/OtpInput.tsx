interface OtpInputProps {
  value: string[];
  onChange: (index: number, value: string) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  return (
    <div className='grid grid-cols-4 gap-2'>
      {value.map((digit, index) => (
        <input key={index} value={digit} onChange={(e) => onChange(index, e.target.value)} maxLength={1} className='h-10 rounded border text-center' />
      ))}
    </div>
  );
}
