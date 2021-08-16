import logo from '../logo.svg';
import { Box } from '@material-ui/core';

export default function ReactStart() {
  return (
    <Box component="main" flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </Box>
  );
}