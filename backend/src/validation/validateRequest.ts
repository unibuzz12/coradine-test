import { AnySchema } from "yup";

const validate = async (schema: AnySchema, args: any) => {
    try {
        await schema.validate({
            args: args
        });
    } catch (e) {
        throw new Error(e.errors as string);
    }
};

export default validate;