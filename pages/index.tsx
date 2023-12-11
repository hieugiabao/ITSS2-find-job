import { GetServerSideProps } from "next";
import dbConnect from "../lib/dbConnect";
import Home from "../components/Home";

type Props = {
  isConnected: boolean;
};

const Index = ({ isConnected }: Props) => {
  return <Home />;
};

/* Trying connect to mongodb */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await dbConnect();

    return { props: { isConnected: true } };
  } catch (err) {
    console.log(err);
    return { props: { isConnected: false } };
  }
};

export default Index;
