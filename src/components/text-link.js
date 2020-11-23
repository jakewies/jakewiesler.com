/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function TextLink({to, children}) {
  return (
    <Link
      to={to}
      sx={{
        color: 'text',
        borderBottom: '1px solid',
        borderColor: 'text',
        paddingBottom: '1px',
        fontSize: 2,
        textDecoration: 'none',
        fontWeight: 'heading'
      }}
    >
      {children}
    </Link>
  )
}
