import { object, string } from "yup";

export const createCollectionSchema = object({
    args: object({
        name: string()
            .max(32)
            .required('Collection name is required.'),
    }),
});