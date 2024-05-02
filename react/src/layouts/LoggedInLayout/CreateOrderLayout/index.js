import { Steps, Step } from "react-step-builder";
import OrderPlacement from "./Module/Placement";
import OrderSearch from "./Module/Search";
import OrderSummary from "./Module/Summary";
import OrderPlaced from "./Module/Placed";
import OrderInput from './Module/Input'

const CreateOrderLayout = () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const id = url.searchParams.get("product");

  return (
    <div style={{ minHeight: "100vh" }}>
      <Steps>
        <Step title={"Order Placement"} type={id} component={OrderInput}></Step>
        <Step title={"Order Placement"} component={OrderPlacement} />
        <Step title={"Search For Suppliers"} component={OrderSearch} />
        <Step title={"Order Summary"} component={OrderSummary} />
        <Step title={"Order Placed"} component={OrderPlaced} />
      </Steps>
    </div>
  );
};

export default CreateOrderLayout;
