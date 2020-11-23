/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'
import {FaTwitter, FaGithub, FaInstagram, FaRss} from 'react-icons/fa'

export function Footer() {
  return (
    <footer sx={{padding: '128px 0 32px'}}>
      <div sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <FooterLink to="/">Home</FooterLink>
        <FooterLink to="/blog">Blog</FooterLink>
        <FooterLink to="/about">About</FooterLink>
        <FooterLink to="/newsletter">Newsletter</FooterLink>
      </div>
      <div
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '36px',
        }}
      >
        <span sx={{fontSize: '14px'}}>
          © {new Date().getFullYear()} Jake Wiesler. All Rights Reserved.
        </span>
        <div>
          <a href="https://twitter.com/jakewies" sx={iconStyles}>
            <FaTwitter />
          </a>
          <a href="https://github.com/jakewies" sx={iconStyles}>
            <FaGithub sx={iconStyles} />
          </a>
          <a href="https://instagram.com/jakewies" sx={iconStyles}>
            <FaInstagram sx={iconStyles} />
          </a>
          <Link to="/blog/rss.xml" sx={iconStyles}>
            <FaRss sx={iconStyles} />
          </Link>
        </div>
      </div>
    </footer>
  )
}

const FooterLink = ({to, children}) => (
  <Link
    to={to}
    sx={{
      color: '#555',
      fontSize: '18px',
      marginRight: '24px',
      textDecoration: 'none',
      '&:last-of-type': {marginRight: 0},
    }}
  >
    {children}
  </Link>
)

const iconStyles = {
  color: '#000',
  fontSize: '18px',
  marginRight: '24px',
  '&:last-of-type': {
    marginRight: 0,
  },
}
