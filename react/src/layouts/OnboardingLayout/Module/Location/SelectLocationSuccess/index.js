import Button from "@material-ui/core/Button"
import Modal from "@material-ui/core/Modal"
import Box from "@material-ui/core/Box"
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import style from "./style";
const SelectLocationSuccess = (props) => {

  return (
    <div>
      <Modal
        style={style.model}
        open={props.showSuccess}
        onClose={props.handleCloseSuccess}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.showSuccess}>
          <div className="p-4" style={style.divP4}>
            <Box className="mb-4" style={style.box}>
              <h3 style={style.h3Location}>Location added successfully</h3>
            </Box>

            <Box style={style.boxbtn}>
              <Button
                variant="contained"
                onClick={props.handleCloseSuccess}
                style={style.btnCancel}
              >
                Cancel
                </Button>

              <Button
                variant="contained"
                // onClick={handleOkay}
                style={style.btnOkay}
              >
                Okay
                  </Button>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default SelectLocationSuccess;