const USER_ID_KEY = 'maiji.localUser.id';
const USER_NAME_KEY = 'maiji.localUser.name';

function makeUserId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);
  const suffix = globalThis.crypto?.randomUUID?.().slice(0, 8) || String(Date.now()).slice(-8);
  return `${slug || 'user'}-${suffix}`;
}

export function getLocalUser() {
  if (typeof window === 'undefined') {
    return { id: 'shared', name: 'Shared' };
  }

  let id = window.localStorage.getItem(USER_ID_KEY);
  let name = window.localStorage.getItem(USER_NAME_KEY);

  if (!id || !name) {
    const input = window.prompt('请输入你的名字或工号，用于隔离个人画板', name || '')?.trim();
    name = input || `用户-${String(Date.now()).slice(-4)}`;
    id = makeUserId(name);
    window.localStorage.setItem(USER_ID_KEY, id);
    window.localStorage.setItem(USER_NAME_KEY, name);
  }

  return { id, name };
}

export function getLocalUserHeaders() {
  const user = getLocalUser();
  return {
    'x-maiji-user-id': user.id,
    'x-maiji-user-name': user.name,
  };
}

export function resetLocalUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(USER_ID_KEY);
  window.localStorage.removeItem(USER_NAME_KEY);
}
