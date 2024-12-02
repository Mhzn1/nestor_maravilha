import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#7C3AED',
    text: '#000',
    background: '#EDE9FE',
    error: 'red',
    success: '#86EFAC',
    'primary-dark': '#2E1065', 
    'text-secondary': '#F4F4F5',
    details: '#FFF',
    details_bottom: '#fafafa'
  },
  radii: {
    md: '30px', 
  },
  styles: {
    global: {
      body: {
        bg: 'background',
        color: 'text',
      },
    },
  },
});

export default theme;
