import Grid from "@material-ui/core/Grid"
import { useEffect } from "react";
import GlobalButton from "../../../../components/GlobalButton";
import verifyStyle from "../../../../theme/Verify/style";
import images from "../../../../images/verifyImage.png";
import firebase from 'firebase'
import { useSelector } from 'react-redux'

const Verify = (props) => {
  const user = useSelector(state => state.user)
  const { email } = user;

  useEffect(() => {
    if (firebase.auth().currentUser.emailVerified) {
      props.next()
    }
    return () => {
    }
  }, [])

  const url = `${window.location.protocol}//${window.location.host}/onboarding`
  var actionCodeSettings = {
    url,
    handleCodeInApp: false, // it was true before
  };

  function sendVerificationEmail() {
    user.sendEmailVerification(actionCodeSettings)

  }

  const contactSupport = () => {
    console.log("Contact the support");
  };

  return (
    <>
      <div>
        <Grid container style={verifyStyle.container}>
          <Grid item lg={3} md={3} sm={2} xs={1} style={verifyStyle.blockOne} />
          <Grid item lg={6} md={6} sm={8} xs={10}>
            <div style={verifyStyle.verifyContent}>
              <h3 style={verifyStyle.margin}>Verify your email</h3>
              <p>
                You will need to verify your email {email} to complete registration.{" "}
              </p>
              <img alt="" style={verifyStyle.verifyImage} src={images} />
              <p>
                An email has been sent to you with a link to verify
                your account. if you have not received the email after a few
                minutes, please check your span folder.
              </p>
            </div>
            <div style={verifyStyle.buttonContainer}>
              <div style={verifyStyle.leftButton}>
                <GlobalButton
                  customPosition={{ position: "relative" }}
                  customTextStyle={{ color: "white" }}
                  backgroundcolor="#42a5f5"
                  text="Resend Email"
                  onClick={() => sendVerificationEmail()}
                />
              </div>
              <div style={verifyStyle.rightButton}>
                <GlobalButton
                  customPosition={{ position: "relative" }}
                  customTextStyle={{ color: "white" }}
                  backgroundcolor="#42a5f5"
                  text="Contact Support"
                  onClick={() => contactSupport()}
                />
              </div>
            </div>
          </Grid>
          <Grid
            item
            lg={3}
            md={3}
            sm={2}
            xs={1}
            style={verifyStyle.blockThree}
          />
        </Grid>
      </div>
    </>
  );
};

export default Verify;
