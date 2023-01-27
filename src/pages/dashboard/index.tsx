import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Textarea from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { db } from "../../services/FirebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const taskRef = collection(db, "tasks");
      const q = query(
        taskRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, snapshot => {
        let list = [] as TasksProps[];

        snapshot.forEach(doc => {
          list.push({
            id: doc.id,
            task: doc.data().task,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(list);
      });
    }

    loadTasks();
  }, [user?.email]);

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked);
  }

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}}`
    );
    alert("URL COPIED");
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);

    await deleteDoc(docRef);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My Dashboard</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What's your task?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Write your task"
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Make the task public</label>
              </div>
              <button type="submit" className={styles.button}>
                Register
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>My tasks</h1>

          {tasks.map(item => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLIC</label>
                  <button className={styles.shareBtn}>
                    <FiShare2
                      size={22}
                      color="#3183ff"
                      onClick={() => handleShare(item.id)}
                    />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}
                <button className={styles.trashBtn}>
                  <FaTrash
                    size={24}
                    color="#ea3140"
                    onClick={() => handleDeleteTask(item.id)}
                  />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  // console.log(session);

  if (!session?.user) {
    // If you don't have a user, we'll redirect you to home '/'
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
