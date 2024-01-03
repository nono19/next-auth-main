import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session : {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        
        if(!credentials?.email || !credentials?.password){
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials?.email }
        });

        if(!user){
          return null;
        }

        const cekPassword = await compare(credentials.password, user.password);

        if(!cekPassword){
          return null;
        }

        return {
          //id pakai backtick supaya authorize tidak error karena harus menerima string
          id: `${user.id}`,
          username: user.username,
          email: user.email
        }
      }
    })
  ]
}