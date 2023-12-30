import type { AppProps } from "next/app";
import Head from "next/head";
import "../css/style.css";
import { SearchProvider } from "../context/search-context";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SearchProvider>
      <Head>
        <title>FindJob</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </SearchProvider>
  );
}

export default MyApp;
