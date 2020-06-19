/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'
import PropTypes from 'prop-types'

export default function PostLink({date, slug, title}) {
  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: ['initial', 'center'],
        mb: 4,
      }}
    >
      <span sx={{color: 'lightgray', mr: 4, fontSize: 1}}>{date}</span>
      <Link
        to={slug}
        sx={{
          textDecoration: 'none',
          color: 'text',
          display: 'inline-block',
          fontSize: 3,
          maxWidth: 450,
        }}
      >
        {title}
      </Link>
    </div>
  )
}

PostLink.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}
