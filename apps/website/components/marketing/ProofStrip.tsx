import { product } from "@/lib/product";

export function ProofStrip() {
  return (
    <section className="border-b border-border bg-elevated/40 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm font-medium text-ink">{product.outcome}</p>
        <ul className="flex flex-col gap-1 text-sm text-muted sm:items-end">
          {product.proof.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
