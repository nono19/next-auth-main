import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    const existingUserEmail = await db.user.findUnique({
      where: {email: email}
    });

    if(existingUserEmail){
      return NextResponse.json({user: null, message: 'this email already use'}, {status: 409})
    }

    const existingUser = await db.user.findUnique({
      where: {username: username}
    });

    if(existingUser){
      return NextResponse.json({user: null, message: 'this username already use'}, {status: 409})
    }
    
    const hashPass = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashPass
      }
    });
    //keluarkan password dari fungsi agar tidak terbawa respon
    const {password: newUserPass, ...rest} = newUser;

    return NextResponse.json({user: rest, message: 'user created'}, {status: 201})

  } catch (error) {
    return NextResponse.json({message: 'something went wrong'}, {status: 500})
  }
}