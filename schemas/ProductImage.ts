import { cloudinaryImage } from "@keystone-6/cloudinary";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
    throw new Error('Cloudinary environment variables are not set');
  }

const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'sabfits',
  };

export const ProductImage = list({
    access: allowAll,
    fields: {
      image: cloudinaryImage({
        cloudinary: cloudinaryConfig,
        label: 'Source',
      }),
      altText: text(),
      product: relationship({ref: 'Product.photo'}),
    },
    ui: {
      listView: {
        initialColumns: ['image', 'altText', 'product'],
      },
    },
  })