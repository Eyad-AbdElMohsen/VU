import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        id
      }
    })

    if (!user) {
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
    }

    return user
  }
}