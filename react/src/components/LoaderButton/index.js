import { Button, CircularProgress } from "@material-ui/core"

export default function LoaderButton({ isLoading, loadingProps, ...rest }) {
  return (
    <Button {...rest}>{isLoading ? <CircularProgress {...loadingProps} /> : rest.children}</Button>
  );
}
