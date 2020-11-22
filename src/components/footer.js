/** @jsx jsx */
import {jsx, Container} from 'theme-ui'
import {Link} from 'gatsby'
import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiOutlineGithub,
} from 'react-icons/ai'

export default function Footer() {
  return (
    <footer
      sx={{
        bg: 'muted',
      }}
    >
      <Container pt={5} pb={5}>
        <div sx={{display: 'flex', justifyContent: 'space-between'}}>
          <div sx={{display: 'flex', flexDirection: 'column'}}>
            <Link to="/" sx={linkStyles}>
              Home
            </Link>
            <Link to="/blog" sx={linkStyles}>
              Blog
            </Link>
          </div>
          <div>
            <a href="https://github.com/jakewies" sx={{mr: 3}}>
              <AiOutlineGithub sx={iconStyles} />
            </a>
            <a href="https://twitter.com/jakewies" sx={{mr: 3}}>
              <AiOutlineTwitter sx={iconStyles} />
            </a>
            <a href="https://instagram.com/jakewies">
              <AiFillInstagram sx={iconStyles} />
            </a>
          </div>
        </div>
        <div
          sx={{
            mt: 4,
            color: 'gray',
            fontSize: 0,
          }}
        >
          © {new Date().getFullYear()} Jake Wiesler
        </div>
      </Container>
    </footer>
  )
}

const linkStyles = {
  textDecoration: 'none',
  color: 'gray',
  fontSize: 1,
  fontWeight: 'body',
  letterSpacing: 1,
  textTransform: 'uppercase',
  mb: 1,
  '&:last-of-type': {
    mb: 0,
  },
  '&:hover': {
    color: 'primary',
  },
}

const iconStyles = {
  color: 'gray',
  fontSize: 4,
  '&:hover': {
    color: 'primary',
  },
}
