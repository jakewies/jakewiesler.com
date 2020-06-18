/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import PropTypes from "prop-types"
import { FiLink } from "react-icons/fi"
import Prism from "@theme-ui/prism"

export default {
  h2: linkHeading("h2"),
  h3: linkHeading("h3"),
  pre: props => props.children,
  code: Prism,
  warning: Warning,
  gif: Gif,
}

function Warning({ children }) {
  return (
    <p
      sx={{
        p: 2,
        lineHeight: "body",
        border: "2px solid",
        borderColor: "primary",
        borderRadius: 4,
        color: "primary",
        fontSize: 1,
        mt: 4,
      }}
    >
      <b>Note:</b> {children}
    </p>
  )
}

Warning.propTypes = {
  children: PropTypes.node.isRequired,
}

function Gif({ src, caption, alt = "A senseless gif" }) {
  return (
    <figure sx={{ mt: 3 }}>
      <img
        src={src}
        alt={alt}
        sx={{
          display: "block",
          width: "100%",
          maxWidth: 375,
          m: "0 auto",
          mt: 4,
        }}
      />
      <figcaption
        sx={{
          width: "90%",
          mt: 3,
          ml: "auto",
          mr: "auto",
          mb: 0,
          fontSize: 0,
          textAlign: "center",
          lineHeight: "body",
          color: "lightgray",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}

Gif.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  alt: PropTypes.string,
}

function linkHeading(Tag) {
  return props => {
    const [toggled, setToggled] = React.useState(false)
    const toggle = () => setToggled(prevState => !prevState)

    if (!props.id) return <Tag {...props} />

    return (
      <Tag
        {...props}
        onMouseEnter={toggle}
        onMouseLeave={toggle}
        sx={{ display: "flex", alignItems: "center" }}
      >
        {props.children}
        <a
          href={`#${props.id}`}
          sx={{
            display: toggled ? "flex" : "none",
            ml: 2,
            textDecoration: "none",
            color: "lightgray",
            fontSize: 3,
            fontWeight: "body",
            "&:hover": {
              color: "text",
            },
          }}
        >
          <FiLink />
        </a>
      </Tag>
    )
  }
}
