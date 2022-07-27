import React from 'react';
import prisma from '../../lib/prisma';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import { getSession } from '@auth0/nextjs-auth0'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const EditTaskMutation = gql`
  mutation($title: String!, $category: String!, $description: String!, $id:String!, $done:Boolean) {
    editTask(title: $title, category: $category, description: $description, id:$id, done:$done) {
      title
      category
      description
      id
      done
    }
  }
`
const DeleteTaskMutation = gql`
  mutation($id:String!) {
    deleteTask(id:$id) {
      id
    }
  }
`


const Task = ({ task }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(task.done)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const [editTask, { loading, error }] = useMutation(EditTaskMutation, {
        onCompleted: () => console.log('completed')
    })

    const [deleteTask, { loading: loading2, error: error2 }] = useMutation(DeleteTaskMutation, {
        onCompleted: () => reset()
    })

    const onSubmit = async data => {
        const { title, category, description, done } = data
        const variables = { title, category, description, id: task.id, done: isDone}
        
        try {
            toast.promise(editTask({ variables }), {
                loading: 'Editing Task..',
                success: 'Task successfully edited!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            })

        } catch (error) {
            console.error(error)
        }
    }

    const onDelete = async(delete_task) => {
        if(delete_task){
            const variables = {id:task.id}
            try {
                toast.promise(deleteTask({variables}), {
                    loading: 'Deleting Task..',
                    success: 'Task deleted successfully!🎉',
                    error: `Something went wrong 😥 Please try again -  ${error}`,
                })
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className='flex justify-center items-center h-3/4'>
            
            <div className={`${isDone ? 'bg-lime-100' : 'bg-yellow-100'} w-2/4 rounded-lg p-5 shadow-md`}>
                <Toaster />
                <h1 className="text-3xl font-medium my-5 text-center mb-2">Edit Task</h1>
                <form className="grid grid-cols-1 gap-y-6 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                    <label className="block">
                        <span className="text-gray-700">Title</span>
                        <input
                            placeholder="Title"
                            name="title"
                            type="text"
                            defaultValue={task.title}
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
                            defaultValue={task.description}
                            className="mt-1 block w-full rounded-md outline-none p-1  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Category</span>
                        <select
                            placeholder="Name"
                            {...register('category', { required: true })}
                            name="category"
                            defaultValue={task.category}
                            type="text"

                            className="block mt-1 w-full rounded-md outline-none p-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>
                    <label className="flex items-center">
                        <label 
                        onClick={() => setIsDone(!isDone)}
                        className={`text-gray-700 shadow-md border-2 border-lime-500  ${isDone ? 'bg-lime-400' : 'bg-white'} rounded-xl p-1 px-2 cursor-pointer`}>Done</label>
                        <input
                            placeholder="done"
                            {...register('done', { required: false })}
                            name="done"
                            defaultChecked={isDone}
                            type="checkbox"

                            className="hidden rounded-md items-center justify-center outline-none ml-2 border-gray-400  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                        </input>
                    </label>
                    <div className='w-full flex justify-end'>
                    <button
                        className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 mr-2 rounded-md hover:bg-blue-600"
                        type='submit'
                        disabled={loading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 animate-spin mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                    <button
                        className="my-4 capitalize bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600"
                        disabled={loading2}
                        onClick={() => onDelete(window.confirm('Are you sure that you want to delete this task?'))}
                    >
                        Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Task;

export const getServerSideProps = async ({ params, req, res }) => {
    const id = params.id;
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

    const task = await prisma.task.findUnique({
        where: { id },
        select: {
            title: true,
            category: true,
            description: true,
            id:true,
            done:true,
        },
    });
    return {
        props: {
            task,
        },
    };
};