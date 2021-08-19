import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles.less';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono&family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>NFTIKI - NFT Marketplace</title>
      </Head>
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </>
  );
}
