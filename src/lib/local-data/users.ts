import { NextRequest } from 'next/server';

export interface UserContext {
  id: string;
  name: string;
}

const DEFAULT_USER: UserContext = {
  id: 'shared',
  name: 'Shared',
};

export function sanitizeUserId(value: string | null | undefined) {
  const safe = (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return safe || DEFAULT_USER.id;
}

export function sanitizeUserName(value: string | null | undefined) {
  const safe = (value || '')
    .trim()
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 80);

  return safe || DEFAULT_USER.name;
}

export function getUserContextFromRequest(request: NextRequest): UserContext {
  return {
    id: sanitizeUserId(request.headers.get('x-maiji-user-id')),
    name: sanitizeUserName(request.headers.get('x-maiji-user-name')),
  };
}

