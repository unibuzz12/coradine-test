import { IResolvers } from '@graphql-tools/utils';
import User from '../../models/userModel';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import validateRequest from '../../validation/validateRequest';
import { signupAuthSchema, loginAuthSchema } from '../../validation/schemas/auth.schema';

interface ISignupArgs {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

interface ILoginArgs {
    email: string,
    password: string
}

const UserResolvers: IResolvers = {
    Query: {
        // Fetch current authenticated user profile
        async me (__:void, args: void, { user }) {
            if (!user) {
                throw new Error('user not authenticated!');
            }

            return await User.findById(user.id);
        }
    },

    Mutation: {
        // Handling user signup
        async signup (__: void, args: ISignupArgs): Promise<string> {
            await validateRequest(signupAuthSchema, args);

            const email = args.email;
            const first_name = args.first_name;
            const last_name = args.last_name;
            const password = args.password;

            // Check email already exist
            const user = await User.findOne({ email });
            
            if (user) {
                throw new Error('Duplicate Email');
            }

            const new_user = await User.create({
                first_name,
                last_name,
                email,
                password: await bcrypt.hash(password, 10)
            })

            // Create json webtoken
            const token: string = jsonwebtoken.sign(
                { id: new_user._id, email: new_user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1y' }
            );

            return JSON.stringify({ 
                success: true,
                token : token
            });
        },

        // Handling user login
        async login (__: void, args: ILoginArgs): Promise<string> {
            await validateRequest(loginAuthSchema, args);

            const email = args.email;
            const password = args.password;
            
            // Check email already exist
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('No user exist with this email');
            }

            const valid = await bcrypt.compare(password, user.password);

            if(!valid) {
                throw new Error('Incorrect email or password');
            }

            // Create json webtoken
            const token: string = jsonwebtoken.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1y' }
            );

            return JSON.stringify({ 
                success: true,
                token : token
            });
        }
    }
};

export default UserResolvers;