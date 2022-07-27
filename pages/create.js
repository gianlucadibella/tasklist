// pages/admin.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation, useQuery } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import { getSession } from '@auth0/nextjs-auth0'


const CreateTaskMutation = gql`
  mutation($title: String!, $category: String!, $description: String!) {
    createTask(title: $title, category: $category, description: $description) {
      title
      category
      description
    }
  }
`

const Create = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const [createTask, { loading, error }] = useMutation(CreateTaskMutation, {
        onCompleted: () => reset()
    })

    const onSubmit = async data => {
        const { title, category, description } = data
        const variables = { title, category, description }
        try {
            toast.promise(createTask({ variables }), {
                loading: 'Creating new Task..',
                success: 'Task successfully created!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            })

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex justify-center items-center h-3/4">
           <div className='bg-slate-100 w-2/4 rounded-lg p-5 shadow-md'>
           <Toaster />
            <form className="grid grid-cols-1 gap-y-6 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-medium my-5 text-center mb-2">Create a new Task</h1>
                <label className="block">
                    <span className="text-gray-700">Title</span>
                    <input
                        placeholder="Title"
                        name="title"
                        type="text"
                        {...register('title', { required: true })}
                        className="mt-1 block w-full rounded-md outline-none p-1  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Description</span>
                    <input
                        placeholder="Description"
                        {...register('description', { required: true })}
                        name="description"
                        type="text"
                        className="mt-1 block w-full rounded-md outline-none p-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Category</span>
                    <select
                        placeholder="Name"
                        {...register('category', { required: true })}
                        name="category"
                        type="text"

                        className="mt-1 block w-full rounded-md outline-none p-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                        <option value="OTHER">Other</option>
                    </select>
                </label>

                <button
                    disabled={loading}
                    type="submit"
                    className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="w-6 h-6 animate-spin mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                            </svg>
                            Creating...
                        </span>
                    ) : (
                        <span>Create Task</span>
                    )}
                </button>
            </form>
            </div>
        </div>
    )
}

export default Create

export const getServerSideProps = async ({ req, res }) => {
    const session = getSession(req, res);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/api/auth/login',
            },
            props: {},
        }
    }

    return {
        props: {},
    }
}