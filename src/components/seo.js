/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ title, description, pageUrl, isBlogPost }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  )

  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="language" content="en" />
      <meta name="description" content={description} />

      {/* OpenGraph tags */}
      <meta
        property="og:url"
        content={`${site.siteMetadata.siteUrl}${pageUrl}`}
      />
      {isBlogPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="https://www.twitter.com/jakewies" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

SEO.defaultProps = {
  pageUrl: "",
  isBlogPost: false,
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pageUrl: PropTypes.string,
  isBlogPost: PropTypes.bool,
}

export default SEO
