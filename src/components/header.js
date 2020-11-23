/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function Header() {
  return (
    <header sx={{my: 6}}>
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
        color: 'gray',
        fontSize: 2,
        mr: 4,
        textDecoration: 'none',
        '&:last-of-type': {mr: 0},
        '&:hover': {color: 'text'},
        '&.active': {color: 'text'},
      }}
    >
      {children}
    </Link>
  )
}
