import prism from '@theme-ui/prism/presets/theme-ui'
import colorModes from '../color-modes'

const {light, ...alternateColorModes} = colorModes

export default {
  breakpoints: ['700px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64, 72],
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontWeights: {
    body: 400,
    heading: 500,
    bold: 700,
  },
  lineHeights: {
    body: 1.65,
    heading: 1.5,
  },
  sizes: {
    container: 600,
  },
  useColorSchemeMediaQuery: true,
  colors: {
    ...light,
    modes: {
      ...alternateColorModes,
    },
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'text',
      cursor: 'pointer',
      fontSize: 2,
    },
  },
  forms: {
    input: {
      bg: 'transparent',
      borderColor: 'lightgray',
      color: 'text',
      outlineColor: 'text',
    },
  },
  layout: {
    container: {
      paddingLeft: [3, 0],
      paddingRight: [3, 0],
    },
    list: {
      mt: 4,
      ml: 4,
      p: 0,
    },
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      mt: 4,
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontSize: '18px',
      fontWeight: 'body',
      lineHeight: '30px',
    },
    h1: {
      variant: 'text.heading',
      fontSize: '29px',
      lineHeight: '46px',
      mt: 0,
    },
    h2: {
      variant: 'text.heading',
      fontSize: '23px',
      lineHeight: '37px',
    },
    h3: {
      variant: 'text.heading',
      fontSize: '18px',
      lineHeight: '30px',
    },
    p: {
      mt: 4,
    },
    a: {
      color: 'primary',
    },
    ul: {
      variant: 'layout.list',
      listStyle: 'none',
      li: {
        mb: 2,
        '::before': {
          content: '"-"',
          color: 'lightgray',
          display: 'inline-block',
          position: 'absolute',
          ml: theme => `-${theme.space[3]}px`,
        },
        'ul &': {
          mb: 0,
        },
      },
    },
    ol: {
      variant: 'layout.list',
      li: {
        mb: 2,
      },
    },
    blockquote: {
      lineHeight: 'body',
      color: 'gray',
      fontStyle: 'italic',
      width: '95%',
      m: '0 auto',
      mt: 4,
    },
    img: {
      display: 'block',
      width: '100%',
      maxWidth: 500,
      m: '0 auto',
      mt: 4,
    },
    code: {
      ...prism,
      bg: 'muted',
      fontSize: 2,
      fontFamily: 'SFMono-Regular,Consolas,Menlo,monospace',
      mt: 4,
      p: 3,
      wordWrap: 'normal',
      overflow: 'auto',
      borderRadius: 3,
    },
    inlineCode: {
      fontSize: 2,
      fontFamily: 'SFMono-Regular,Consolas,Menlo,monospace',
      p: 1,
      m: 0,
      bg: 'muted',
      borderRadius: 3,
    },
  },
}
