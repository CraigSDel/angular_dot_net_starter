import { expect, test } from '@playwright/test';

test('loads the home page and navigates to each management screen', async ({ page }) => {
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

test('creates and deletes a user through the UI', async ({ page }) => {
  await page.goto('/users');
  const firstName = `Playwright-${Date.now()}`;

  await page.getByLabel('Firstname').fill(firstName);
  await page.getByLabel('Lastname').fill('Test');
  await page.getByRole('button', { name: 'Save' }).click();

  const row = page.locator('tbody tr').filter({ hasText: firstName });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Delete' }).click();
  await expect(row).toHaveCount(0);
});

test('supports task and task-group CRUD through the published API and UI', async ({ page, request }) => {
  const userResponse = await request.post('/api/v1/users', { data: { firstName: `E2E-${Date.now()}`, lastName: 'Owner' } });
  const user = await userResponse.json();
  const taskResponse = await request.post('/api/v1/tasks', { data: { name: 'E2E task', deadline: '2030-01-01T00:00:00Z', status: 'To-Do', userId: user.id } });
  const task = await taskResponse.json();
  const groupResponse = await request.post('/api/v1/task-groups', { data: { name: 'E2E group', taskIds: [task.id] } });
  const group = await groupResponse.json();

  await page.goto('/tasks');
  await expect(page.getByRole('cell', { name: 'E2E task' })).toBeVisible();
  await page.goto('/task-groups');
  await expect(page.getByRole('cell', { name: 'E2E group' })).toBeVisible();

  await request.put(`/api/v1/task-groups/${group.id}`, { data: { name: 'E2E group', taskIds: [] } });
  await request.delete(`/api/v1/task-groups/${group.id}`);
  await request.delete(`/api/v1/tasks/${task.id}`);
  await request.delete(`/api/v1/users/${user.id}`);
});
