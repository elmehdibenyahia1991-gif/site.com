import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <section className="container-page max-w-3xl space-y-3">
      <h1 className="text-3xl font-bold">Refund Policy</h1>
      <p className="text-slate-700">
        Digital products are delivered instantly after successful payment. Because of the immediate access, refunds are
        only issued when the file is corrupted, inaccessible, or significantly different from the product description.
      </p>
      <p className="text-slate-700">Contact support within 7 days of purchase so we can review your request.</p>
      <Link href="/contact" className="text-brand underline">
        Contact support
      </Link>
    </section>
  );
}
