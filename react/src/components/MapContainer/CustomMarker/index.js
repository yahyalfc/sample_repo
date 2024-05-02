import "./Marker.css";
import style from "./style";

const Marker = (props) => {
  //const markerStyle = props.style;

  // console.log("inMarker", { ...props.style });
  // {console.log("style", markerStyle.left)}
  // const [markerStyle, setMarkerStyle] = useState(props);
  const { name } = props;
  return (
    <div>
      <div
        className="pin bounce"
        style={(style.divPinbounce, { ...props.style })}
        title={name}
      />
    </div>
  );
};

export default Marker;
