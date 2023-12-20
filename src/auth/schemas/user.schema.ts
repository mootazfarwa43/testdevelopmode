import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    SUPERADMIN = 'superadmin',
}


@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop()
    name: string;

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;

    @Prop()
    password: string;

    @Prop({ type: [String], default: [UserRole.CUSTOMER] })
    roles: UserRole[];

    hasRole(role: UserRole): boolean {
        return this.roles.includes(role);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);