/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Global } from '@emotion/core'
import { Header } from './header'
import { Footer } from './footer'

export function Layout({ children }) {
  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        maxWidth: '1024px',
        my: 0,
        mx: 'auto',
      }}
    >
      <GlobalStyles />
      <Header />
      <main
        sx={{
          flexGrow: 1,
          py: 5,
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
    styles={{
      'html, body, #___gatsby, #gatsby-focus-wrapper': {
        height: '100%',
        margin: 0,
      },
      '*': {
        margin: 0,
        padding: 0,
      },
    }}
  />
)
