import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Time Capsule 3.0 - Digital Memory Keeper & Future Vault',
  description: 'Preserve memories, create posts, and schedule future time capsules with rich countdowns and unlock celebrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
