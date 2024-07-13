import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { integer, relationship, select, text } from "@keystone-6/core/fields";

export const CartItem = list({
    access: allowAll,
    ui: {
        listView: {
            initialColumns: ['product', 'quantity', 'user']
        }
    },
    fields: {
        // TODO: custom label here
        quantity: integer({
            defaultValue: 1,
            validation: {isRequired: true},
        }),
        product: relationship({ref: 'Product'}),
        user: relationship({ref: 'User.cart'}),
    },
});