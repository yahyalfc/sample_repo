import style from "../../theme/GlobalButton/style";

const GlobalButton = (props) => {
  const {
    text = "Your Text Here",
    customPosition = {},
    type = {},
    backgroundcolor = "lightblue",
    customTextStyle = {},
  } = props;

  return (
    <button
      type={type}
      style={{
        ...style.buttonCustompos,
        backgroundColor: backgroundcolor,
        ...customPosition,
      }}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <div>
        <div style={style.divFlex}>
          <p style={{ ...style.pPadding, ...customTextStyle }}>{text} </p>
        </div>
      </div>
    </button>
  );
};

export default GlobalButton;
