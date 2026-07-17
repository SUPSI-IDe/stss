import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Pathname } from '$app/types';
import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';
import { FLOW_ANIMATION_MS } from './config.js';
import { nodeKey } from './model.js';
import { setPendingScroll } from '../overlayScroll';
import type { NodeData, TooltipData } from '../types';

type InteractionOptions = {
	isMobile: () => boolean;
	isMobileRootNode: (label: string) => boolean;
	onOpenTooltip: (tooltip: TooltipData, anchorX: number, anchorY: number) => void;
	onPageHoverChange: (pageRoute: string | null) => void;
	onMobileSelectionChange: (hasSelection: boolean) => void;
};

export class DiagramInteraction {
	hoveredNode = $state<NodeData | null>(null);
	mobileSelectedNodeKey = $state<string | null>(null);
	mobileHighlightActive = $state(false);
	progress = new Tween(0, { duration: FLOW_ANIMATION_MS, easing: cubicOut });

	constructor(private options: InteractionOptions) {}

	animateFlows = () => {
		this.progress.set(0, { duration: 0 });
		this.progress.set(1);
	};

	enterNode = (node: NodeData) => {
		if (this.options.isMobile()) return;
		this.hoveredNode = node;
		this.options.onPageHoverChange(node.pageRoute ?? null);
		this.animateFlows();
	};

	leaveNode = () => {
		if (this.options.isMobile()) return;
		this.hoveredNode = null;
		this.options.onPageHoverChange(null);
	};

	nodeRole = (node: NodeData): 'button' | 'link' => {
		if (this.options.isMobile() && this.options.isMobileRootNode(node.label)) return 'button';
		return node.pageRoute ? 'link' : 'button';
	};

	nodeAriaLabel = (node: NodeData) => {
		if (this.options.isMobile() && this.options.isMobileRootNode(node.label)) {
			return this.mobileSelectedNodeKey === nodeKey(node.row, node.label)
				? `${node.label} flows expanded. Activate again to open the page`
				: `Explore flows through ${node.label}`;
		}
		return node.pageRoute ? `Open the ${node.label} page` : `Show flows through ${node.label}`;
	};

	nodeHref = (node: NodeData): Pathname => {
		if (!node.pageRoute) return '/' as Pathname;
		const hashIndex = node.pageRoute.indexOf('#');
		return (hashIndex === -1 ? node.pageRoute : node.pageRoute.slice(0, hashIndex)) as Pathname;
	};

	nodeTabIndex = (node: NodeData) => {
		if (!this.options.isMobile()) return 0;
		return this.options.isMobileRootNode(node.label) || node.pageRoute ? 0 : -1;
	};

	focusNode = (node: NodeData) => {
		if (!this.options.isMobile()) this.enterNode(node);
	};

	blurNode = () => {
		if (!this.options.isMobile()) this.leaveNode();
	};

	clearFlowHighlight = () => {
		this.hoveredNode = null;
		this.mobileHighlightActive = false;
		this.progress.set(0, { duration: 0 });
		this.options.onPageHoverChange(null);
	};

	activateNode = (node: NodeData) => {
		if (this.options.isMobile() && this.options.isMobileRootNode(node.label)) {
			const key = nodeKey(node.row, node.label);
			if (this.mobileSelectedNodeKey !== key) {
				this.mobileSelectedNodeKey = key;
				this.mobileHighlightActive = true;
				this.options.onMobileSelectionChange(true);
				this.options.onPageHoverChange(null);
				this.animateFlows();
				return;
			}
		}
		if (!node.pageRoute) {
			if (!this.options.isMobile()) this.enterNode(node);
			return;
		}
		const hashIndex = node.pageRoute.indexOf('#');
		if (hashIndex !== -1) setPendingScroll(node.pageRoute.slice(hashIndex));
		const path = (hashIndex === -1 ? node.pageRoute : node.pageRoute.slice(0, hashIndex)) as Pathname;
		this.clearFlowHighlight();
		void goto(resolve(path)).finally(() => this.options.onPageHoverChange(null));
	};

	clickNode = (event: MouseEvent, node: NodeData) => {
		if (node.pageRoute) event.preventDefault();
		if (this.options.isMobile() || node.pageRoute) event.stopPropagation();
		this.activateNode(node);
	};

	keydownNode = (event: KeyboardEvent, node: NodeData) => {
		const activates = event.key === 'Enter' || (this.nodeRole(node) === 'button' && event.key === ' ');
		if (!activates) return;
		event.preventDefault();
		event.stopPropagation();
		this.activateNode(node);
	};

	resetMobileView = () => {
		if (!this.options.isMobile() || !this.mobileSelectedNodeKey) return;
		this.mobileSelectedNodeKey = null;
		this.options.onMobileSelectionChange(false);
		this.clearFlowHighlight();
	};

	openBadge = (event: MouseEvent | KeyboardEvent, tooltip: TooltipData) => {
		event.stopPropagation();
		const rect = (event.currentTarget as SVGGElement).getBoundingClientRect();
		this.options.onOpenTooltip(tooltip, rect.left, rect.top);
	};

	keydownBadge = (event: KeyboardEvent, tooltip: TooltipData) => {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		this.openBadge(event, tooltip);
	};
}
