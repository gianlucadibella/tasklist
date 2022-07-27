import { useUser } from '@auth0/nextjs-auth0'
import React from 'react';

export const TaskCard = ({
    title,
    category,
    description,
    done,
    deleted,
    id,
}) => {
    const categoryColor = {
        'WORK':'bg-blue-500', 
        'HOME':'bg-orange-500', 
        'OTHER':'bg-indigo-500'
    }
    
    return (
        <>
    
    <div key={id} className={`shadow  max-w-md  rounded ${!done ? 'bg-yellow-100' : 'bg-lime-200'}`}>
                <div className="p-5 flex flex-col space-y-2">
                    <div className={`rounded-lg ${categoryColor[category]} text-center w-20`}>
                    <p className="text-sm font-bold text-white">{category}</p>
                    </div>
                    <p className="text-lg font-medium">{title}</p>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>   
        </>
    );
};