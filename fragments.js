import { graphql } from "gatsby"

export const pageTreeFragement = graphql`
  fragment pageTree on Query {
    currentPage: allSitePage(filter: {path: {eq:$slug}}) {
        edges {
          node {
            menu
            path
          }
        }
      }
  }
`
