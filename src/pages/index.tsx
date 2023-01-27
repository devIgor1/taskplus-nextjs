import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/home.module.css";
import Image from "next/image";
import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/FirebaseConnection";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks+ | Easily organize your tasks</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Task Logo"
            src={heroImg}
            priority
          />
          <h1 className={styles.title}>
            System created for you to organize your studies and tasks
          </h1>

          <div className={styles.infoContent}>
            <section className={styles.box}>
              <span>+{posts} posts</span>
            </section>
            <section className={styles.box}>
              <span>+{comments} comments</span>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //fetch the numbers from the bank and send them to the component

  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tasks");

  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60,
  };
};
