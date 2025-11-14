import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { CompanyModule } from "../companies/company.module";
import { UserModule } from "../users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { SessionModule } from "../session/session.module";


@Module({
  imports: [CompanyModule, UserModule, SessionModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }