import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal"
import { Steps, Step } from "react-step-builder";
import DocketInfo from "./DocketInfo";
import DocketInput from "./DocketInput";

function GenerateDeliveryDocketModal(props) {
  const { open, handleClose, order } = props;

  return (
    <Grid style={{ paddingBottom: 70, paddingTop: 30 }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ overflow: 'scroll' }}
      >
        {order && <Steps>
          <Step orderX={order} handleClose={handleClose} component={DocketInput} />
          <Step orderX={order} handleClose={handleClose} component={DocketInfo} />
        </Steps>}
      </Modal>
    </Grid>
  );
}

export default GenerateDeliveryDocketModal;