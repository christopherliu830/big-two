import { createMuiTheme } from '@material-ui/core/styles';

const peri = [
  '#000000',
  '#141419',
  '#282833',
  '#3d3d4c',
  '#515166',
  '#66667f',
  '#7a7a99',
  '#8e8eb2',
  '#a3a3cc',
  '#b7b7e5',
  '#ccccff',
];

const bluey = [
  '#000000',
  '#141719',
  '#282e33',
  '#3d454c',
  '#515c66',
  '#66737f',
  '#7a8a99',
  '#a3b8cc',
  '#b7cfe5',
  '#cce6ff',
];

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: peri[9],
    },
    secondary: {
      main: bluey[9],
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    button: {
      textTransform: 'none',
      fontStyle: 'normal',
      fontFamily: 'Open Sans',
      fontSize: '1.4em',
    },
  },
});
