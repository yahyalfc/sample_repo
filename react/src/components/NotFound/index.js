import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
// import Page from './../Page';
import image from "../../images/page_not_found.jpg"
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (

    <Box
      display="flex"
      flexDirection="column"
      height="auto"
      justifyContent="center"
      margin="50px"
    >
      <Container maxWidth="md">
        <Typography
          align="center"
          color="textPrimary"
          variant="h2"
        >
          404: The page you are looking for isn’t here
          </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="subtitle2"
        >
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation
          </Typography>
        <Box textAlign="center">
          <img
            alt="Under development"
            className={classes.image}
            src={image}

          />
        </Box>
      </Container>
    </Box >
  );
};

export default NotFound;