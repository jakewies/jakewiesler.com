/** @jsx jsx */
import {jsx, Button, useColorMode} from 'theme-ui'
import colorModes from '../color-modes'

export default function ColorModeToggle() {
  const [colorMode, setColorMode] = useColorMode()

  const handleSetColorMode = e => {
    setColorMode(prevColorMode => getNextColorMode(prevColorMode))
  }

  return (
    <Button
      aria-label="Toggle Color Mode"
      onClick={handleSetColorMode}
      sx={{
        fontSize: 1,
        fontWeight: 'bold',
        px: 2,
        py: 1,
        bg: 'muted',
        color: 'primary',
        '&:focus': {
          outlineColor: 'primary',
        },
      }}
    >
      {colorMode.charAt(0).toUpperCase() + colorMode.slice(1)}
    </Button>
  )
}

const getNextColorMode = prevColorMode => {
  const modes = Object.keys(colorModes)
  const prevIndex = modes.indexOf(prevColorMode)
  const nextIndex = prevIndex + 1

  // go back to beginning
  if (nextIndex > modes.length - 1) {
    return 'light'
  }

  return modes[nextIndex]
}
