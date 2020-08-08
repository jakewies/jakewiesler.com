/** @jsx jsx */
import {jsx, Container} from 'theme-ui'
import React from 'react'
import PropTypes from 'prop-types'
import {Global} from '@emotion/core'
import Header from 'components/header'
import Footer from 'components/footer'

const GlobalStyles = () => (
  <Global
    styles={theme => ({
      'html, body, #___gatsby, #gatsby-focus-wrapper': {
        height: '100%',
        margin: 0,
      },
      '#gatsby-focus-wrapper': {
        display: 'flex',
        flexDirection: 'column',
      },
      '*': {
        margin: 0,
        padding: 0,
      },
    })}
  />
)

export default function Layout({children, showFooter = true}) {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Header />
      <main
        sx={{
          flexGrow: 1,
        }}
      >
        <Container pt={4} pb={5}>
          {children}
        </Container>
      </main>
      {showFooter ? <Footer /> : null}
    </React.Fragment>
  )
}

Layout.propTypes = {
  showFooter: PropTypes.bool,
}
