import "./Select.css";
const Select = ({
  placeholder = "placeholder",
  type = "text",
  name = "",
  value = "",
  required = {},
  onChange = {},
  options = {},
  style = {},
}) => {
  return (
    <div>
      <select
        className="input"
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        style={style}
      >
        <option value="" disabled selected hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option   >{option}</option>
        ))}
      </select>
    </div>
  );
};
export default Select;
