import type { AppProps } from "next/app";
import Head from "next/head";
import "../css/style.css";
import { SearchProvider } from "../context/search-context";
import Footer from "../components/Footer";
import { UserProvider } from "../context/user-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FindJob</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <UserProvider>
        <SearchProvider>
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </SearchProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
