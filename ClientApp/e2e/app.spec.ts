import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

async function createUser(request: APIRequestContext, firstName = unique('E2E-User')) {
  const response = await request.post('/api/v1/users', { data: { firstName, lastName: 'Test' } });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<{ id: number; firstName: string; lastName: string }>;
}

async function createTask(request: APIRequestContext, userId: number, name = unique('E2E-Task')) {
  const response = await request.post('/api/v1/tasks', {
    data: { name, deadline: '2030-01-01T00:00:00Z', status: 'To-Do', userId }
  });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<{ id: number; name: string; userId: number }>;
}

async function createGroup(request: APIRequestContext, name: string, taskIds: number[]) {
  const response = await request.post('/api/v1/task-groups', { data: { name, taskIds } });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<{ id: number; name: string }>;
}

async function deleteResource(request: APIRequestContext, path: string) {
  const response = await request.delete(path);
  expect([200, 204, 404]).toContain(response.status());
}

async function chooseMaterialOption(page: Page, label: string, option: string) {
  await page.getByRole('combobox', { name: label }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test('renders the home page and navigates to every management screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'User Task Management' })).toBeVisible();

  for (const [path, heading] of [
    ['/users', 'Users'],
    ['/tasks', 'Tasks'],
    ['/task-groups', 'Task Groups']
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('loads, creates, edits, and deletes users through the UI', async ({ page, request }) => {
  const existing = await createUser(request);
  const firstName = unique('Playwright');
  const updatedFirstName = `${firstName}-Updated`;

  try {
    await page.goto('/users');
    await expect(page.getByRole('row').filter({ hasText: existing.firstName })).toBeVisible();

    await page.getByLabel('Firstname').fill(firstName);
    await page.getByLabel('Lastname').fill('Created');
    await page.getByRole('button', { name: 'Save' }).click();

    const createdRow = page.getByRole('row').filter({ hasText: firstName });
    await expect(createdRow).toBeVisible();
    await createdRow.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Firstname').fill(updatedFirstName);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('row').filter({ hasText: updatedFirstName })).toBeVisible();

    const updatedRow = page.getByRole('row').filter({ hasText: updatedFirstName });
    await updatedRow.getByRole('button', { name: 'Delete' }).click();
    await expect(updatedRow).toHaveCount(0);
  } finally {
    await deleteResource(request, `/api/v1/users/${existing.id}`);
  }
});

test('shows user save errors without losing entered values', async ({ page }) => {
  await page.goto('/users');
  const firstName = unique('Invalid-User');
  await page.getByLabel('Firstname').fill(firstName);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter a first and last name.');
  await expect(page.getByLabel('Firstname')).toHaveValue(firstName);
});

test('prevents deleting a user that has assigned tasks', async ({ page, request }) => {
  const user = await createUser(request);
  const task = await createTask(request, user.id);

  try {
    await page.goto('/users');
    const row = page.getByRole('row').filter({ hasText: user.firstName });
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('alert')).toContainText('Remove this user’s tasks before deleting the user.');
  } finally {
    await deleteResource(request, `/api/v1/tasks/${task.id}`);
    await deleteResource(request, `/api/v1/users/${user.id}`);
  }
});

test('creates, edits, and deletes tasks through the UI', async ({ page, request }) => {
  const user = await createUser(request);
  const taskName = unique('Playwright-Task');
  const updatedTaskName = `${taskName}-Updated`;

  try {
    await page.goto('/tasks');
    await page.getByLabel('Name').fill(taskName);
    await page.locator('input[formcontrolname="deadline"]').fill('2030-02-02');
    await chooseMaterialOption(page, 'User', `${user.firstName} ${user.lastName}`);
    await chooseMaterialOption(page, 'Status', 'To-Do');
    await page.getByRole('button', { name: 'Save' }).click();

    const createdRow = page.getByRole('row').filter({ hasText: taskName });
    await expect(createdRow).toBeVisible();
    await createdRow.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Name').fill(updatedTaskName);
    await chooseMaterialOption(page, 'Status', 'Done');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('row').filter({ hasText: updatedTaskName })).toContainText('Done');

    const updatedRow = page.getByRole('row').filter({ hasText: updatedTaskName });
    await updatedRow.getByRole('button', { name: 'Delete' }).click();
    await expect(updatedRow).toHaveCount(0);
  } finally {
    const tasks = await (await request.get('/api/v1/tasks')).json() as Array<{ id: number; name: string }>;
    for (const task of tasks.filter(item => item.name === taskName || item.name === updatedTaskName)) {
      await deleteResource(request, `/api/v1/tasks/${task.id}`);
    }
    await deleteResource(request, `/api/v1/users/${user.id}`);
  }
});

test('rejects invalid task references and shows task save errors', async ({ page, request }) => {
  const response = await request.post('/api/v1/tasks', {
    data: { name: unique('Invalid-Task'), deadline: '2030-01-01T00:00:00Z', status: 'To-Do', userId: 2147483647 }
  });
  expect(response.status()).toBe(400);

  await page.goto('/tasks');
  await page.route('**/api/v1/tasks', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 400, contentType: 'application/problem+json', body: '{"title":"Invalid reference"}' });
    } else {
      await route.continue();
    }
  });
  await page.getByLabel('Name').fill(unique('Rejected-Task'));
  await page.locator('input[formcontrolname="deadline"]').fill('2030-01-01');
  await chooseMaterialOption(page, 'Status', 'To-Do');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('Check the selected user and task group.');
});

test('creates, edits, and deletes task groups through the UI', async ({ page, request }) => {
  const user = await createUser(request);
  const firstTask = await createTask(request, user.id, unique('Group-Task-A'));
  const secondTask = await createTask(request, user.id, unique('Group-Task-B'));
  const groupName = unique('Playwright-Group');
  const updatedGroupName = `${groupName}-Updated`;

  try {
    await page.goto('/task-groups');
    await page.getByLabel('Name').fill(groupName);
    await chooseMaterialOption(page, 'User Tasks', firstTask.name);
    await page.getByRole('button', { name: 'Save' }).click();

    const createdRow = page.getByRole('row').filter({ hasText: groupName });
    await expect(createdRow).toContainText(firstTask.name);
    await createdRow.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Name').fill(updatedGroupName);
    await page.getByRole('combobox', { name: 'User Tasks' }).click();
    await page.getByRole('option', { name: firstTask.name, exact: true }).click();
    await page.getByRole('option', { name: secondTask.name, exact: true }).click();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Save' }).click();

    const updatedRow = page.getByRole('row').filter({ hasText: updatedGroupName });
    await expect(updatedRow).toContainText(secondTask.name);
    await updatedRow.getByRole('button', { name: 'Delete' }).click();
    await expect(updatedRow).toHaveCount(0);
  } finally {
    const groups = await (await request.get('/api/v1/task-groups')).json() as Array<{ id: number; name: string }>;
    for (const group of groups.filter(item => item.name === groupName || item.name === updatedGroupName)) {
      await request.put(`/api/v1/task-groups/${group.id}`, { data: { name: group.name, taskIds: [] } });
      await deleteResource(request, `/api/v1/task-groups/${group.id}`);
    }
    await deleteResource(request, `/api/v1/tasks/${firstTask.id}`);
    await deleteResource(request, `/api/v1/tasks/${secondTask.id}`);
    await deleteResource(request, `/api/v1/users/${user.id}`);
  }
});

test('prevents deleting a task group that contains tasks', async ({ page, request }) => {
  const user = await createUser(request);
  const task = await createTask(request, user.id);
  const group = await createGroup(request, unique('Protected-Group'), [task.id]);

  try {
    await page.goto('/task-groups');
    const row = page.getByRole('row').filter({ hasText: group.name });
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('alert')).toContainText('Remove the group’s tasks before deleting the group.');
  } finally {
    await request.put(`/api/v1/task-groups/${group.id}`, { data: { name: group.name, taskIds: [] } });
    await deleteResource(request, `/api/v1/task-groups/${group.id}`);
    await deleteResource(request, `/api/v1/tasks/${task.id}`);
    await deleteResource(request, `/api/v1/users/${user.id}`);
  }
});

test('keeps content clear of the desktop sidebar and supports mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/users');
  const sidebar = await page.locator('.app-sidenav').boundingBox();
  const content = await page.locator('.app-content').boundingBox();
  expect(sidebar).not.toBeNull();
  expect(content).not.toBeNull();
  expect(content!.x).toBeGreaterThanOrEqual(sidebar!.width - 1);
  await expect(page.getByLabel('Firstname')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('link', { name: 'Users', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByLabel('Firstname')).toBeVisible();
});
