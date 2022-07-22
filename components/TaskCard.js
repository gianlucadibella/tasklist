import React from 'react';

export const TaskCard = ({
    title,
    category,
    description,
    done,
    deleted,
    id
}) => {
    return (
        <div key={id} className="shadow  max-w-md  rounded">
            <div className="p-5 flex flex-col space-y-2">
                <p className="text-sm text-blue-500">{category}</p>
                <p className="text-lg font-medium">{title}</p>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};