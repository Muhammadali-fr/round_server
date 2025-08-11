import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'public_key'
        })
    ],
    exports: [JwtModule]
})

export class AppJwtModule { }