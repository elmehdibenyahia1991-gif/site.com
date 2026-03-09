'use client';

import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage({ params, searchParams }: { params: { id: string }; searchParams: { token?: string } }) {
  const [message, setMessage] = useState('Finalizing payment...');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    async function finalize() {
      if (!searchParams?.token) return setMessage('Missing PayPal order token.');

      const capture = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: searchParams.token, productId: params.id })
      });
      const captureData = await capture.json();
      if (!capture.ok) return setMessage(captureData.error || 'Capture failed');

      const download = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id })
      });
      const downloadData = await download.json();
      if (download.ok && downloadData.url) {
        setDownloadUrl(downloadData.url);
        setMessage('Payment successful. Download unlocked.');
      } else {
        setMessage('Payment successful but download link unavailable.');
      }
    }

    finalize();
  }, [params.id, searchParams?.token]);

  return (
    <section className="container-page max-w-xl space-y-3">
      <h1 className="text-2xl font-bold">Payment status</h1>
      <p className="text-slate-700">{message}</p>
      {downloadUrl ? <a href={downloadUrl} className="inline-block rounded bg-brand px-4 py-2 text-white">Download product</a> : null}
    </section>
  );
}
