import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  email: string;
};

const FormWithHook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted:', data);
    alert('Form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md p-4 mx-auto border rounded">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="border rounded w-full p-2"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
          className="border rounded w-full p-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default FormWithHook;
