import { GetServerSideProps } from 'next';
import dbConnect from '../lib/dbConnect';

type Props = {
  isConnected: boolean;
}

const Index = ({ isConnected }: Props) => {
  return (
    <>
      <h1>Welcome to Next.js!</h1>
      <p>Build something amazing!</p>
      <p>
        {isConnected
          ? 'You are connected to MongoDB'
          : 'You are NOT connected to MongoDB. Please check the .env file to make sure you entered your MONGODB_URL correctly and try again.'}
      </p>
    </>
  )
}

/* Trying connect to mongodb */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await dbConnect()

    return { props: { isConnected: true } }
  } catch (err) {
    console.log(err)
    return { props: { isConnected: false } }
  }
}

export default Index
