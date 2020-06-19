/** @jsx jsx */
import {jsx, Styled} from 'theme-ui'
import PropTypes from 'prop-types'

// Component for now.mdx

export default function NowHeader({date}) {
  return (
    <header>
      <Styled.h1>What I'm Doing Now</Styled.h1>
      <time
        dateTime={date}
        sx={{
          color: 'lightgray',
          display: 'inline-block',
          fontSize: 2,
        }}
      >
        {date}
      </time>
    </header>
  )
}

NowHeader.propTypes = {
  date: PropTypes.string.isRequired,
}
