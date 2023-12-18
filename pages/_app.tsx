import type { AppProps } from "next/app";
import Head from "next/head";
import "../css/style.css";
import { SearchProvider } from "../context/search-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SearchProvider>
      <Head>
        <title>FindJob</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </SearchProvider>
  );
}

export default MyApp;
