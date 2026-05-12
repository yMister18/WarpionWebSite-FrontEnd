import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'warpion_admin_session';

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('Missing required environment variable: ADMIN_PASSWORD');
  }

  return password;
}

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || 'warpion-admin';
}

export function isValidAdminPassword(password: string) {
  return password === getAdminPassword();
}

export async function createAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminUsername(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  return Boolean(session?.value);
}

export async function getAdminActor() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? 'unknown-admin';
}