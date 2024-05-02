
import "./Input.css";
const Input = ({
  placeholder = "placeholder",
  type = "text",
  name = "",
  value = "",
  required = {},
  onChange = {},
  pattern = null,
  step = null,
}) => {
  return (
    <div>
      <input
        className="input"
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        pattern={pattern}
        step={step}
      />
    </div>
  );
};
export default Input;
