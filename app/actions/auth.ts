'use server';

import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function register(formData: FormData) {
  if (!process.env.DATABASE_URL) {
    return { error: 'قاعدة البيانات غير متصلة (DATABASE_URL مفقود). يرجى إضافة رابط قاعدة بيانات PostgreSQL في إعدادات الأسرار (Secrets) أو تشغيل المشروع عبر Docker.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'البريد الإلكتروني وكلمة المرور مطلوبة' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First user is admin
    const count = await prisma.user.count();
    const role = count === 0 ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = await signToken({ userId: user.id });
    const cookieStore = await cookies();
    cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    return { success: true };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من صحة رابط DATABASE_URL.' };
  }
}

export async function login(formData: FormData) {
  if (!process.env.DATABASE_URL) {
    return { error: 'قاعدة البيانات غير متصلة (DATABASE_URL مفقود). يرجى إضافة رابط قاعدة بيانات PostgreSQL في إعدادات الأسرار (Secrets) أو تشغيل المشروع عبر Docker.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'البريد الإلكتروني وكلمة المرور مطلوبة' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: 'بيانات الدخول غير صحيحة' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: 'بيانات الدخول غير صحيحة' };
    }

    const token = await signToken({ userId: user.id });
    const cookieStore = await cookies();
    cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من صحة رابط DATABASE_URL.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { success: true };
}
