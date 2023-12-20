import { ExtractJwt , Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";



@Injectable()
export class Jwtstrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name)
    private userModel: Model<User>) {
        super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration : false ,
        secretOrKey : 'secrete' ,
    })

    }
    async validate (payload) {
        const {id}= payload;
        const user = await this.userModel.findById(id);
        if(!user){
            throw new UnauthorizedException('Login in first to access');
        }
        return user
    }
}