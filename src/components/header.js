/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function Header() {
  return (
    <header sx={{padding: '64px 0'}}>
      <nav
        sx={{
          display: 'flex',
        }}
      >
        <div>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </nav>
    </header>
  )
}

function NavLink({to, children}) {
  return (
    <Link
      to={to}
      activeClassName="active"
      sx={{
        color: '#555',
        fontSize: '18px',
        marginRight: '24px',
        textDecoration: 'none',
        '&:last-of-type': {marginRight: 0},
        '&.active': {color: '#000'},
      }}
    >
      {children}
    </Link>
  )
}
