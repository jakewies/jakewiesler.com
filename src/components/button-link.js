/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function ButtonLink({to, children}) {
  return (
    <Link
      to={to}
      sx={{
        display: 'inline-block',
        color: '#fff',
        backgroundColor: '#000',
        padding: '14px 28px',
        fontSize: '18px',
        letterSpacing: '1px',
        cursor: 'pointer',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      {children}
    </Link>
  )
}
