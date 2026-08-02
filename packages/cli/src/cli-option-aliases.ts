/**
 * Canonical CLI spellings are `--output` and `--redaction-profile`.
 * Legacy aliases `--out` and `--profile` remain supported through the current major.
 */

export function resolveOutputOption(options: {
  output?: string;
  out?: string;
}): string | undefined {
  const canonical = options.output?.trim();
  if (canonical) return canonical;
  const legacy = options.out?.trim();
  return legacy || undefined;
}

export function resolveRedactionProfileOption(options: {
  redactionProfile?: string;
  profile?: string;
}): string | undefined {
  const canonical = options.redactionProfile?.trim();
  if (canonical) return canonical;
  const legacy = options.profile?.trim();
  return legacy || undefined;
}
