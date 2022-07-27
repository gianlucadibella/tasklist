import { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { gql, useQuery } from "@apollo/client";
import { useUser } from '@auth0/nextjs-auth0';
import { TaskCard } from '../components/TaskCard';


const AllTaskQuery = gql`
query allTasksQuery($first: Int, $after: String) {
  tasks(first: $first, after: $after){
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        title
        description
        category
        deleted
        done
        }
    }
  }
  }
`

// const userInfo = gql`
// query fetchUser{
//    user{
//     email
//     id
//     tasklist{
//       title,
//       description,
//       id
//     }
//    }

// }
// `


export default function Home() {
  const { user } = useUser();
  const [category, setCategory] = useState('ALL')
  const { data, error, loading, fetchMore } = useQuery(AllTaskQuery, {
    variables: {
      first: 2
    }
  });

  if (!user) {
    return (
      <div className="h-full">
        <div className='flex flex-col justify-center float-left w-2/3 h-full bg-gray-50 '>
          <div className='ml-32'>
            <h1 className='font-extrabold text-left	text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-500 to-slate-500 pb-2'>TaskList App</h1>
            <h2 className='font-extrabold text-left	text-5xl bg-clip-text w-3/4'>Manage your tasks on a simple manner using Tasklist</h2>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center h-full w-1/3 bg-gray-50'>

          <h1 className='font-extrabold text-9xl leading-loose drop-shadow-lg w-full text-center'>📝</h1>
          <Link href="/api/auth/login" className='w-full text-center'>
            <a className="block bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded  text-white font-normal text-xl">
              Login
            </a>
          </Link>
          <p>If you don't have an account <Link href="api/auth/login"><a className='underline text-blue-500 font-semibold'>Sign up</a></Link></p>
        </div>
      </div>
    );
  }


  if (loading) return <p>Loading...</p>

  if (error) return <p>Ooops, something went wrong {error.message}</p>

  const { endCursor, hasNextPage } = data?.tasks.pageInfo;

  return (
    <div className={styles.container}>
      <Head>
        <title>Task App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <div className="container mx-auto max-w-5xl my-20 px-5">
        <>
          <div className='flex mb-5'>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Filter task by</label>
            <select onChange={(e) => setCategory(e.target.value)} id="task" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option defaultValue='ALL' value="ALL" key="all">All</option>
              <option value="HOME" key="home">Home</option>
              <option value="WORK" key="work">Work</option>
              <option value="OTHER" key="other">Other</option>
            </select>
          </div>

          <h1 className='text-4xl font-semibold mb-5'>
            Tasks
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
            {data?.tasks.edges.map(({ node }, i) => (
              <>
                {(category == node.category && node.deleted == false) ? (
                  <Link href={`/task/${node.id}`} key={i}>
                    <a>
                      <TaskCard
                        title={node.title}
                        category={node.category}
                        id={node.id}
                        description={node.description}
                        done={node.done}
                        key={node.id}
                      />
                    </a>
                  </Link>
                ) : (
                  <>
                    {(category == 'ALL' && node.deleted == false) && (
                      <Link href={`/task/${node.id}`} key={i}>
                        <a>
                          <TaskCard
                            title={node.title}
                            category={node.category}
                            id={node.id}
                            description={node.description}
                            done={node.done}
                            key={node.id}
                          />
                        </a>
                      </Link>
                    )}
                  </>
                )}
              </>
            ))}
          </div>
          <div>
            {hasNextPage ? (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded my-10"
                onClick={() => {
                  fetchMore({
                    variables: { after: endCursor },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                      fetchMoreResult.tasks.edges = [
                        ...prevResult.tasks.edges,
                        ...fetchMoreResult.tasks.edges
                      ];
                      return fetchMoreResult;
                    }
                  });
                }}
              >
                more
              </button>

            ) : (
              <p className="my-10 text-center font-medium">
                No more tasks to display, <Link href="create"><a className='underline text-blue-500 font-semibold'>create one</a></Link>
              </p>
            )}
          </div>
        </>
      </div>
    </div>
  )
}
