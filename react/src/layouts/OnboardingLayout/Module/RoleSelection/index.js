import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Grid from "@material-ui/core/Grid"
import Link from "@material-ui/core/Link"
import style from "../../../../theme/RoleSelection/style";
import ToggleButton from "./ToggleButton";
import { useSelector } from 'react-redux'

const RoleSelection = (props) => {
  const [userRole, setUserRole] = useState("Customer");
  const [check, setCheck] = useState(false);
  const handleSetRole = (value) => {
    setUserRole(value);
  };
  const user = useSelector(state => state.user)
  const { role } = user

  useEffect(() => {
    if (role == 'Supplier' || role == 'Customer') {
      window.location.href = '/app/dashboard'
    }
  }, [])

  const roleSelected = () => {
    props.setState("data", { role: userRole });

    if (userRole == "Supplier") {
      props.next();
    }
    if (userRole == "Customer") {
      props.next();
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Grid container>
        <Grid md={12} style={{ marginTop: 50 }}>
          <p style={style.text}>Complete your free account setup</p>
          <p style={style.text1}>I am a:</p>
          <Grid>
            <ToggleButton handleSetRole={handleSetRole} userRole={userRole} />
          </Grid>
          <Grid
            item
            md={12}
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <Grid item md={4}></Grid>
            <Grid item md={4}>
              <Grid style={style.Grid}>
                <Grid>
                  <Checkbox
                    defaultChecked
                    style={{ color: "#42a5f5" }}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </Grid>
                <Grid style={style.Grid2}>
                  <p
                    style={{ color: "#707070", fontSize: 18, lineHeight: 1.4 }}
                  >
                    Yes! Send me genuinely useful emails every now and then to
                    help me get the most out of Klinker
                  </p>
                </Grid>
              </Grid>
              <Grid style={style.Grid3}>
                <Grid>
                  <Checkbox
                    style={{ color: "#42a5f5" }}
                    // defaultChecked
                    value={check}
                    onClick={() => setCheck(!check)}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </Grid>
                <Grid style={style.textGrid}>
                  <p style={style.color2}>
                    Yes, I understand and agree to the{" "}
                    <Link style={style.color}>Klinker Terms of Services</Link>,
                    including the{" "}
                    <Link style={style.color}>User Agreement</Link> and{" "}
                    <Link style={style.color}>Privacy Policy</Link>{" "}
                  </p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4}></Grid>
          </Grid>

          <Grid container>
            <Grid item md={4}></Grid>
            <Grid item md={4} style={{ marginLeft: 30 }}>
              <Grid container>
                <Grid item md={11}>
                  <Button
                    onClick={() => roleSelected()}
                    style={style.button}
                    disabled={!check}
                    className="buttonCustomerProfile"
                  >
                    <p style={style.textcreateaccount}>Create my account</p>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={3}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RoleSelection;
