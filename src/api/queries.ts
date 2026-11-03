/**
 * Shopify Storefront API v2025-01 GraphQL Operations
 *
 * These are the PRODUCTION queries/mutations that replace the sample data.
 * They are documented here and referenced in shopifyClient.ts.
 *
 * Docs: https://shopify.dev/docs/api/storefront/2025-01
 */

export const GET_ALL_PRODUCTS_QUERY = /* GraphQL */ `
  query GetAllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url(transform: { maxWidth: 800 })
                altText
              }
            }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_QUERY = /* GraphQL */ `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url(transform: { maxWidth: 800 })
            altText
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_QUERY = /* GraphQL */ `
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url(transform: { maxWidth: 1000 })
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url(transform: { maxWidth: 800 })
                  altText
                }
              }
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($collectionHandle: String!, $first: Int!) {
    collection(handle: $collectionHandle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 2) {
              edges {
                node {
                  url(transform: { maxWidth: 600 })
                  altText
                }
              }
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url(transform: { maxWidth: 800 })
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url(transform: { maxWidth: 200 })
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    id title
                    images(first: 1) { edges { node { url altText } } }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    id title
                    images(first: 1) { edges { node { url altText } } }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    id title
                    images(first: 1) { edges { node { url altText } } }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                product {
                  id title
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
        subtotalAmount { amount currencyCode }
      }
    }
  }
`;

export const CART_BUYER_IDENTITY_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
          phone
          customer {
            id
            displayName
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes {
          code
          applicable
        }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;


