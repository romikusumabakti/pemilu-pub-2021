import { Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loading() {
  return (
    <Box component="main" flexGrow={1} display="flex" alignItems="center" justifyContent="center">
      <CircularProgress />
    </Box>
  );
}