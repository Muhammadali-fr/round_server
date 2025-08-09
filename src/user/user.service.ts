import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(
    private database: DatabaseService
  ) { }

  async find_all() {
    return await this.database.user.findMany()
  }

  async find_one(id: string) {
    const user = await this.database.user.findUnique({
      where: { id },
      include: { products: true }
    })

    if (!user) throw new NotFoundException('user not found')

    return user
  }
}
