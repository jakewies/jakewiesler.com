/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import React from "react"
import Layout from "components/layout"
import Seo from "components/seo"
import NewsletterForm from "components/newsletter-form"

export default function MailPage() {
  const [showConfirmMessage, setShowConfirmMessage] = React.useState(false)

  return (
    <Layout breadcrumb="/mail">
      <Seo
        title="Jake Wiesler"
        description="Sign up for my private email list."
        pageUrl="/mail"
      ></Seo>
      {showConfirmMessage ? (
        <React.Fragment>
          <Styled.h3 sx={{ mt: 0 }}>You're almost subscribed!</Styled.h3>
          <Styled.p sx={{ mt: 2 }}>
            I sent you an email to confirm your address. Click it and you're in!
          </Styled.p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Styled.p sx={{ mt: 0 }}>
            I send out an email every now and again.
          </Styled.p>
          <Styled.p>
            If you want to stay up-to-date on what I'm doing / learning /
            pursuing, subscribe!
          </Styled.p>
          <Styled.p sx={{ mb: 4 }}>
            No spam. Unfollow whenever you'd like.
          </Styled.p>
          <NewsletterForm
            onSubscribe={() => {
              setShowConfirmMessage(true)
            }}
          />
          <Styled.p sx={{ fontSize: 0, color: "primary", mt: 2 }}>
            Not sure?{" "}
            <a
              href="https://buttondown.email/jakewiesler/archive"
              alt="Browse the archive"
              sx={{ color: "primary" }}
            >
              Browse the archive
            </a>
            .
          </Styled.p>
        </React.Fragment>
      )}
    </Layout>
  )
}
