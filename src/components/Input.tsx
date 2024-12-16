interface Props {
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = (props: Props) => {
  const { type, value, placeholder, onChange } = props;
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="px-2 py-1 border border-gray-500 rounded-lg"
    />
  );
};

export default Input;
