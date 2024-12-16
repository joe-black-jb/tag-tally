interface Props {
  title: string;
  onClick: () => void;
}

const Button = (props: Props) => {
  const { title, onClick } = props;
  return (
    <button
      className="hover:bg-gray-200 px-2 py-1 border border-gray-500 rounded-lg"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
