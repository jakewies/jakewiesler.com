/** @jsx jsx */
import { jsx, Input, Button } from "theme-ui"
import React from "react"
import PropTypes from "prop-types"
import { Formik } from "formik"
import * as Yup from "yup"
import { useButtondown } from "react-buttondown"

// TODO: move this out into config file or env file
const BUTTONDOWN_API_KEY = "bb75e88a-ff48-4f7c-994b-3b65a7975a34"

export default function NewsletterForm({ onSubscribe }) {
  const { addSubscriber } = useButtondown(BUTTONDOWN_API_KEY)

  const handleOnSubmit = async (values, actions) => {
    try {
      await addSubscriber(values.email)
      onSubscribe()
    } catch (err) {
      actions.setErrors({
        email:
          "There was an error processing your email address. Please try again.",
      })
      actions.setSubmitting(false)
    }
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleOnSubmit}
        validationSchema={Yup.object().shape({
          email: Yup.string().required(""),
        })}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          dirty,
          isSubmitting,
          errors,
        }) => (
          <React.Fragment>
            <form
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: ["column", "row"],
                alignItems: "center",
              }}
            >
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                sx={{
                  flexGrow: 1,
                  mr: [0, 3],
                  bg: "background",
                  borderColor: errors.email ? "primary" : "highlight",
                  "&:focus": {
                    outlineColor: "text",
                  },
                }}
              />

              <Button
                type="submit"
                sx={{
                  bg: "primary",
                  width: ["100%", 200],
                  mt: [3, 0],
                  fontWeight: "bold",
                  "&:disabled": {
                    bg: "muted",
                    color: "lightgray",
                    cursor: "initial",
                  },
                }}
                disabled={!dirty || isSubmitting}
              >
                {isSubmitting ? "Subscribing" : "Subscribe"}
              </Button>
            </form>
            {errors.email && (
              <div
                sx={{
                  fontSize: 0,
                  color: "primary",
                  lineHeight: "body",
                  mt: 3,
                }}
              >
                {errors.email}
              </div>
            )}
          </React.Fragment>
        )}
      </Formik>
    </React.Fragment>
  )
}

NewsletterForm.propTypes = {
  onSubscribe: PropTypes.func.isRequired,
}
