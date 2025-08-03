import { Schema } from "firebase/ai";

export const AddressSchema = Schema.object({
  properties: {
    address: Schema.string({
      example: "Rua Benjamin Constant, Avenida Brasil",
    }),
    neighborhood: Schema.string({ example: "Centro" }),
    number: Schema.string({ example: "100, 25A" }),
    complement: Schema.string(),
    city: Schema.string({ example: "Campinas, Valinhos" }),
  },
});
