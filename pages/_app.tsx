import type { AppProps } from "next/app";
import Head from "next/head";
import "../css/style.css";
import { SearchProvider } from "../context/search-context";
import Footer from "../components/Footer";
import { UserProvider } from "../context/user-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SearchProvider>
        <Head>
          <title>FindJob</title>
        </Head>
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </SearchProvider>
    </UserProvider>
  );
}

export default MyApp;
