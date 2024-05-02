import style from "./style";
import googleImg from "../../../../../../images/google.png"
import fbImg from "../../../../../../images/fb.png"
const SocialLogin = (props) => {

  const {
    anchor,
    backgroundcolor = "lightblue",
    text = "Button",
    socialLoginClickHandler = () => { },
  } = props;

  return (
    <div
      style={{
        ...style.divBorderm20,
        backgroundColor: backgroundcolor,
        borderColor: backgroundcolor,
        width: '80%'

      }}
      onClick={socialLoginClickHandler}
    >
      <a href={anchor}>
        <div style={style.divFlexAlignDecor}>
          {text === "Google" ? (
            <img
              src={googleImg}
              style={style.imgGoogle}
              alt="Some image here"
            />
          ) : (
            <img
              src={fbImg}
              style={{ ...style.imgGoogle }}
              alt="Some image here"
            />
          )}
          {text}
        </div>
      </a>
    </div>
  );
};

export default SocialLogin;