/** @jsx jsx */
import {jsx, Container} from 'theme-ui'
import {Link} from 'gatsby'
import PropTypes from 'prop-types'
import ColorModeToggle from 'components/color-mode-toggle'

export default function Header({breadcrumb}) {
  return (
    <header>
      <Container
        pt={5}
        pb={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          sx={{
            margin: 0,
            fontSize: 3,
            fontWeight: 'heading',
            letterSpacing: 0,
            color: 'text',
          }}
        >
          <Link to="/" sx={{color: 'text', textDecoration: 'none'}}>
            jakewies
            <span sx={{color: 'lightgray'}}>{breadcrumb}</span>
          </Link>
        </h3>
        <ColorModeToggle />
      </Container>
    </header>
  )
}

Header.propTypes = {
  breadcrumb: PropTypes.string.isRequired,
}
