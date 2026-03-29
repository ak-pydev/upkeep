import type { PartSuggestion, PartVendorLink } from "./types";

const VENDOR_URLS: Record<PartVendorLink["vendor"], string> = {
  mcmaster: "https://www.mcmaster.com/products?query=",
  grainger: "https://www.grainger.com/search?searchQuery="
};

export function buildVendorLink(vendor: PartVendorLink["vendor"], term: string): string {
  return `${VENDOR_URLS[vendor]}${encodeURIComponent(term)}`;
}

export function createPartSuggestion(label: string, reason: string): PartSuggestion {
  const term = label.trim();
  return {
    label: term,
    reason,
    vendorLinks: [
      { vendor: "mcmaster", searchUrl: buildVendorLink("mcmaster", term) },
      { vendor: "grainger", searchUrl: buildVendorLink("grainger", term) }
    ]
  };
}

export function uniquePartLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const label of labels) {
    const normalized = label.trim().replace(/\s+/g, " ");
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(normalized);
  }

  return output;
}

