const remarkSlug = require("remark-slug")

module.exports = {
  siteMetadata: {
    siteUrl: `https://jakewiesler.com`,
    social: {
      github: "jakewies",
      twitter: "jakewies",
      instagram: "jakewies",
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-88270202-1`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".md", ".mdx"],
        remarkPlugins: [remarkSlug],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => ({
                guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                date: edge.node.fields.date,
                title: edge.node.fields.title,
                description:
                  edge.node.frontmatter.description || edge.node.excerpt,
                custom_elements: [{ "content:encoded": edge.node.html }],
              }))
            },
            query: `
          {
            allMdx(
              sort: { fields: frontmatter___date, order: DESC }
              filter: { fileAbsolutePath: { regex: "//content/blog//" } }
            ) {
              edges {
                node {
                  excerpt
                  fields { slug title date }
                  frontmatter { description }
                  html
                }
              }
            }
          }
          `,
            output: "/blog/rss.xml",
            title: `Jake Wiesler's Blog RSS Feed`,
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui`,
    //     name: `Gatsby Starter Blog`, //   options: { //   resolve: `gatsby-plugin-manifest`, // {
    //     short_name: `GatsbyJS`,
    //     start_url: `/`,
    //     background_color: `#ffffff`,
    //     theme_color: `#663399`,
    //     display: `minimal-ui`,
    //     icon: `content/assets/gatsby-icon.png`,
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
