"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_config3 = require("dotenv/config");
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_cloudinary = require("@keystone-6/cloudinary");
var import_config = require("dotenv/config");
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      //posts: relationship({ ref: 'Post.author', many: true }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    }
  }),
  Product: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      description: (0, import_fields.text)({
        ui: {
          displayMode: "textarea"
        }
      }),
      photo: (0, import_fields.relationship)({
        ref: "ProductImage.product",
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineCreate: { fields: ["image", "altText"] },
          inlineEdit: { fields: ["image", "altText"] }
        }
      }),
      status: (0, import_fields.select)({
        options: [
          { label: "Draft", value: "DRAFT" },
          { label: "Available", value: "AVAILABLE" },
          { label: "Unavailable", value: "UNAVAILABLE" }
        ],
        defaultValue: "DRAFT",
        ui: {
          displayMode: "segmented-control",
          createView: { fieldMode: "hidden" }
        }
      }),
      price: (0, import_fields.integer)()
      // TODO: photo
    }
  }),
  ProductImage: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      image: (0, import_cloudinary.cloudinaryImage)({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_KEY,
          apiSecret: process.env.CLOUDINARY_SECRET,
          folder: "sabfits"
        },
        label: "source"
      }),
      altText: (0, import_fields.text)(),
      product: (0, import_fields.relationship)({ ref: "Product.photo" })
    },
    ui: {
      listView: {
        initialColumns: ["image", "altText", "product"]
      }
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_config2 = require("dotenv/config");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
      enableLogging: true,
      idField: { kind: "uuid" }
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      //provider: 'sqlite',
      //url: 'file:./keystone.db',
    },
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      }
    },
    lists,
    session
  })
);
//# sourceMappingURL=config.js.map
