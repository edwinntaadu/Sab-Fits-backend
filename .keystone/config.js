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
var import_config = require("dotenv/config");
var import_cloudinary = require("@keystone-6/cloudinary");
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}
var cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "sabfits"
};
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
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
        cloudinary: cloudinaryConfig,
        label: "Source"
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
var import_config2 = require("dotenv/config");
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");

// lib/mail.ts
var import_nodemailer = require("nodemailer");
var transport = (0, import_nodemailer.createTransport)({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 10),
  // Convert port to number
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
function makeANiceEmail(text2) {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text2}</p>
      <p>\u{1F618}, Sab</p>
    </div>
  `;
}
async function sendPasswordResetEmail(resetToken, to) {
  const info = await transport.sendMail({
    to,
    from: "test@example.com",
    subject: "Your password reset token",
    html: makeANiceEmail(`Your Password Reset Token is here!
      
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `)
  });
  if (process.env.MAIL_USER && process.env.MAIL_USER.includes("ethereal.email")) {
    console.log(`\u{1F48C} Message Sent! Preview it at ${(0, import_nodemailer.getTestMessageUrl)(info)}`);
  }
}

// auth.ts
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is not set");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "id name email createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}
var databaseUrl = process.env.DATABASE_URL;
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "postgresql",
      url: databaseUrl,
      enableLogging: true,
      idField: { kind: "uuid" }
    },
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      }
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    }
  })
);
//# sourceMappingURL=config.js.map
