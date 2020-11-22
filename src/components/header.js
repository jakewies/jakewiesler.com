/** @jsx jsx */
import {jsx, Container} from 'theme-ui'
import {Link} from 'gatsby'

export default function Header() {
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
        <Link to="/" sx={{color: 'text', textDecoration: 'none'}}>
          <span
            sx={{
              margin: 0,
              fontSize: 3,
              fontWeight: 'heading',
              color: 'text',
            }}
          >
            Jake Wiesler
          </span>
        </Link>
        <nav>
          <Link to="/blog" sx={navLinkStyles} activeClassName="active">
            Blog
          </Link>
        </nav>
      </Container>
    </header>
  )
}

const navLinkStyles = {
  color: 'text',
  textDecoration: 'none',
  fontSize: 2,
  mr: 1,
  px: 3,
  py: 2,
  borderRadius: 3,
  '&:hover': {
    bg: 'muted',
  },
  '&.active': {
    bg: 'muted',
  },
  '&:last-child': {
    mr: 0,
  },
}
