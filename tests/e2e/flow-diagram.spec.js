import { expect, test } from '@playwright/test';

async function waitForDiagram(page) {
	await page.goto('/');
	await page.evaluate(() => document.fonts.ready);
	await expect(page.locator('.diagram-svg')).toBeVisible();
}

test.describe('flow diagram', () => {
	test('desktop hover reveals routed flows and exposes real links', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 832 });
		await waitForDiagram(page);
		const nodeTextStyle = await page.locator('.node text').first().evaluate((element) => {
			const style = getComputedStyle(element);
			return { fontFamily: style.fontFamily, textTransform: style.textTransform };
		});
		expect(nodeTextStyle.fontFamily).toContain('Helvetica Neue');
		expect(nodeTextStyle.textTransform).toBe('uppercase');
		await page.locator('.node[data-node-label="seeing"] .node-action').hover();
		await expect(page.locator('.flows path[stroke-opacity="0.9"]').first()).toBeVisible();
		await expect(page.getByRole('link', { name: /^Open the / }).first()).toHaveAttribute('href', /\//);
	});

	test('mobile root expands and keyboard reset restores the four roots', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await waitForDiagram(page);
		const nodes = page.locator('.node');
		await expect(nodes).toHaveCount(4);

		const seeing = page.getByRole('button', { name: 'Explore flows through seeing' });
		await seeing.click();
		await expect(page.locator('.node[data-node-label="seeing"] .node-action')).toHaveAttribute(
			'aria-expanded',
			'true'
		);
		await expect.poll(() => nodes.count()).toBeGreaterThan(4);
		await expect(page.locator('.mobile-intro')).toHaveAttribute('aria-hidden', 'true');

		const reset = page.getByRole('button', { name: 'Reset diagram' });
		await reset.focus();
		await reset.press('Enter');
		await expect(nodes).toHaveCount(4);
		await expect(page.locator('.mobile-intro')).toHaveAttribute('aria-hidden', 'false');
	});
});
