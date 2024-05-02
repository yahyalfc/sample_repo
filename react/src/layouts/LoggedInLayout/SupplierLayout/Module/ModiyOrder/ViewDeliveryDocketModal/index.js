import Modal from "@material-ui/core/Modal"
import Grid from '@material-ui/core/Grid'
import ViewDocket from './ViewDocket'
import { Steps, Step } from "react-step-builder";

function ViewDeliveryDocketModal(props) {
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
        <>
          <Steps>
            {
              order &&
              order.docket.map((dock, index) =>
                <Step orderX={order} step={index} docket={dock} handleClose={handleClose} component={ViewDocket} />
              )
            }
          </Steps>
        </>
      </Modal>
    </Grid>
  );
}

export default ViewDeliveryDocketModal
/*

*/