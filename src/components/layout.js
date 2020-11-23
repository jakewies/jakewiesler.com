/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Global } from '@emotion/core'
import { Header } from './header'
import { Footer } from './footer'

export function Layout({ children }) {
  return (
    <div
      sx={{
        minHeight: '100%',
        maxWidth: 1024,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GlobalStyles />
      <Header />
      <main
        sx={{
          flexGrow: 1,
          padding: '64px 0',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

const GlobalStyles = () => (
  <Global
    styles={theme => ({
      'html, body, #___gatsby, #gatsby-focus-wrapper': {
        height: '100%',
        margin: 0,
      },
      '*': {
        margin: 0,
        padding: 0,
      },
    })}
  />
)
