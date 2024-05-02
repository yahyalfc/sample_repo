import {
  createStyles,
  Grid,
  AppBar,
  Toolbar,
  TextField,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Footer() {
  const height = 40;
  return (
    <AppBar style={styles.rootsm}>
      <Toolbar>
        <Grid container justify="center" style={styles.root}>
          <Grid
            xl={2}
            lg={2}
            md={2}
            sm={12}
            xs={12}
            item={true}
            style={{ marginTop: 20 }}
          >
            <ul>
              <li style={styles.type}>CONTACT US </li>
              <br />
              <Link to="#">
                <li style={styles.href}>+44 345 678 903</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>klinker@gmail.com</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Find a store</li>
              </Link>
            </ul>
          </Grid>
          <Grid
            xl={2}
            lg={2}
            md={2}
            sm={12}
            xs={12}
            item={true}
            style={{ marginTop: 20 }}
          >
            <ul>
              <li style={styles.type}>CUSTOMER SERVICE</li>
              <br />
              <Link to="#">
                <li style={styles.href}>Contact Us</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Ordering & Payment</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Shipping</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Returns</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>FAQ</li>
              </Link>
            </ul>
          </Grid>

          <Grid
            xl={2}
            lg={2}
            md={2}
            sm={12}
            xs={12}
            item={true}
            style={{ marginTop: 20 }}
          >
            <ul>
              <li style={styles.type}>INFORMATION </li>
              <br />
              <Link to="#">
                <li style={styles.href}>Work With Us</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Privacy Policy</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Terms & Conditions</li>
              </Link>
              <Link to="#">
                <li style={styles.href}>Press Enquiries</li>
              </Link>
            </ul>
          </Grid>

          <Grid xl={4} lg={4} md={4} sm={12} xs={12} style={{ marginTop: 20 }}>
            <p style={styles.hrefEmail}>Subscribe to klinker via Email</p>

            <Grid style={{ display: "flex", flexDirection: "row" }}>
              <TextField
                size="small"
                // customStyle={style.TextInput}
                placeholder="Email"
                // value={email}
                // onChange={onChangeEmail}
                variant="outlined"
                style={{ height }}
              />
              <Button
                style={{
                  backgroundColor: "white",
                  color: "#42a5f5",
                  marginLeft: "20px",
                  textTransform: "capitalize",
                  width: "40%",
                  height: 40,
                }}
              >
                Subscribe
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
const styles = createStyles({
  root: {
    padding: 20,
  },
  rootsm: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: "#42a5f5",
    position: "relative",
    bottom: 0,
    width: "100%",
  },
  footerTextStyle: {
    fontSize: 12,
    textAlign: "left",
    marginTop: 6,
  },
  textAlignCenter: {
    textAlign: "center",
  },
  textDecorationNone: { textDecoration: "none" },
  href: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    listStyle: "none",
  },
  hrefEmail: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    listStyle: "none",
    marginBottom: 5,
  },
  type: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    listStyle: "none",
  },
});
