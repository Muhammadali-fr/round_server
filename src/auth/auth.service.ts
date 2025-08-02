// dtos 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// prisma 
import { PrismaService } from '../prisma/prisma.service';

// token 
import { JwtService } from '@nestjs/jwt';

// mailer 
import { MailerService } from '../mailer/mailer.service';

// common 
import { HttpException, Injectable } from '@nestjs/common';

// interfaces 
import { ReqWithUser } from 'src/interfaces/req-with-user.interface';

// aws 
import { AwsService } from 'src/lib/aws/aws.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailer: MailerService,
    private aws: AwsService,
  ) { }

  async registerUser(data: RegisterDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existUser) {
      throw new HttpException('User already exists, please login instead.', 400);
    }

    const verifyToken = this.jwt.sign({
      email: data.email,
      name: data.name,
      method: "register"
    }, {
      expiresIn: '10m',
    });

    const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verifyToken}`;
    this.mailer.sendMail(
      data.email,
      `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`
    );

    return {
      message: `Message sent to ${data.email}, please verify your email to complete registration.`,
    }
  }

  async loginUser(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new HttpException('User not found, please register first.', 404);
    }

    const token = this.jwt.sign({
      email: user.email,
      method: "login"
    }, { expiresIn: '15m' });

    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
    this.mailer.sendMail(
      user.email,
      `<a href="${magicLink}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Login</button></a>`
    );

    return {
      message: `Magic link sent to ${user.email}, please check your email to login.`,
    }
  }

  async verifyToken(token: string) {
    const data = this.jwt.verify(token);
    if (!data) {
      throw new HttpException('Invalid token', 400);
    }

    // Registering user
    if (data.method === "register") {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new HttpException('User already exists, please login instead.', 400);
      }

      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
        },
      });

      if (!newUser) {
        throw new HttpException('User registration failed.', 500);
      }

      const accessToken = this.jwt.sign({
        email: newUser.email,
        id: newUser.id,
        action: "access"
      });
      const resetToken = this.jwt.sign({
        email: newUser.email,
        id: newUser.id,
        action: "reset"
      });


      return { accessToken, resetToken };
    }

    // Logging in user
    if (data.method === "login") {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (!user) {
        throw new HttpException('User not found.', 404);
      }

      const accessToken = this.jwt.sign({
        email: user.email,
        id: user.id,
        action: "access"
      });
      const resetToken = this.jwt.sign({
        email: user.email,
        id: user.id,
        action: "reset"
      });

      return { accessToken, resetToken };
    }
  }

  async getProfile(req: ReqWithUser) {
    const data = await this.prisma.user.findUnique({
      where: { email: req.user.email }
    })

    if (!data) {
      throw new HttpException('User not found.', 404);
    }

    return data;
  }

  async resetToken(token: string) {
    const payload = this.jwt.verify(token);
    if (!payload || payload.action !== "reset") {
      throw new HttpException('Invalid reset token.', 400);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    })

    if (!user) {
      throw new HttpException('User not found.', 404);
    }

    const access_token: string = this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        action: 'access',
      },
      { expiresIn: '48h' },
    );

    return access_token
  }

  async updateProfile(
    req: ReqWithUser,
    file?: Express.Multer.File,
    name?: string,
    role?: 'CUSTOMER' | 'ADMIN'
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: req.user.email
      }
    })

    if (!user) {
      throw new HttpException("user not found.", 404)
    }

    if (!file && !name) {
      throw new HttpException("Nothing to update", 400);
    }

    let profileUrl = user.profile;

    if (file) {
      profileUrl = await this.aws.uploadProfile(file);
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? user.name,
        profile: profileUrl,
        role: role ?? user.role,
      }
    })

    return {
      message: 'user updated succesfully',
      user: updated
    }
  }
}
