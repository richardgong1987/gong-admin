import { z } from "zod";

export const laptopSchema = z.object({
    id: z.number().int().nonnegative().default(0),
    laptopCode: z.string().default(""),
    officeLicense: z.string().default(""),
    microsoftAccount: z.string().default(""),
    productId: z.string().default(""),
    skuId: z.string().default(""),
    licenseName: z.string().default(""),
    licenseDescription: z.string().default(""),
    betaExpiration: z.string().default(""),
    licenseStatus: z.string().default(""),
    status: z.string().default(""),
    remark: z.string().default(""),
});

export type Laptop = z.infer<typeof laptopSchema>;
export type FormValues = z.output<typeof laptopSchema>;
