# Sab Fits

## Project Description

"Sab Fits" is a full-stack online clothing store complete with real credit checkout. Users can search, sell, add to cart, and checkout their favorite items.

## Features

- **User Management**: Authentication and user role management.
- **Product Management**: Add, update, delete, and view products.
- **Order Processing**: Complete order lifecycle from cart to checkout.
- **Payment Integration**: Real credit card payments via Stripe.
- **Email Notifications**: Automated email notifications for various actions.
- **GraphQL API**: Data fetching and mutations using Apollo Client.
- **Admin Interface**: Manage application data through a Keystone.js admin interface.
- **Responsive Design**: Fully responsive design using Styled Components.

## Models

The application includes six main models:

- **Users**
- **Items**
- **Orders**
- **CartItems**
- **OrderItems**
- **Roles**

## Technologies Used

- **Frontend**:

  - React.js: For building the user interface.
  - Next.js: For server-side rendering, routing, and tooling.
  - Styled Components: For styling components.
  - Context API: For managing local state.
  - Apollo Client: For GraphQL data management, including mutations and queries.
  - Jest & React Testing Library: For testing.

- **Backend**:
  - Keystone.js: Node.js-based GraphQL server and headless CMS.
  - Prisma: For database management.
  - Stripe: For payment processing.
  - Node.js: For server-side logic.
  - GraphQL: For API queries and mutations.
  - TypeScript: Ensuring type safety across the backend.

## Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Start the development server with `npm run dev`

## Contributions

Contributions are welcome. Please open an issue or submit a pull request.
