import { cloudinaryImage } from '@keystone-6/cloudinary';
import 'dotenv/config';
// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      //posts: relationship({ ref: 'Post.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Product: list({
    access: allowAll,
    fields: {
      name: text({validation: {isRequired: true }}),
      description: text({
        ui: {
          displayMode: 'textarea',
        },
      }),
      photo: relationship({
        ref: 'ProductImage.product',
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'altText'],
          inlineCreate: { fields: ['image', 'altText'] },
          inlineEdit: { fields: ['image', 'altText'] },
        },
      }),
      status: select({
        options: [
          {label: 'Draft', value: 'DRAFT' },
          {label: 'Available', value: 'AVAILABLE' },
          {label: 'Unavailable', value: 'UNAVAILABLE' },
        ],
        defaultValue: 'DRAFT',
        ui: {
          displayMode: 'segmented-control',
          createView: {fieldMode: 'hidden'},
        },
      }),
      price: integer(),
      // TODO: photo
    },
  }),
  ProductImage: list({
    access: allowAll,
    fields: {
      image: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_KEY,
          apiSecret: process.env.CLOUDINARY_SECRET,
          folder: 'sabfits',
        },
        label: 'source'
      }),
      altText: text(),
      product: relationship({ref: 'Product.photo'}),
    },
    ui: {
      listView: {
        initialColumns: ['image', 'altText', 'product'],
      },
    },
  }),
};
