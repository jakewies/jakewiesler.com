/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function TextLink({to, children}) {
  return (
    <Link
      to={to}
      sx={{
        color: '#000',
        borderBottom: '1px solid #000',
        paddingBottom: '1px',
        fontSize: '18px',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  )
}
