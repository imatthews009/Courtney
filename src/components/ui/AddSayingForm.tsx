import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { Saying } from '../App';
import { AlertCircleIcon } from 'lucide-react';
import { useGoogleSheet } from '~/hooks/useGoogleSheet';
type FormData = {
  text: string;
  imagePrompt: string;
};
type AddSayingFormProps = {
  onAddSaying: (saying: FormData) => void;
};
export const AddSayingForm: React.FC<AddSayingFormProps> = ({
  onAddSaying
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { list, updateSheet, sheetData } = useGoogleSheet();
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get current sheet data and append the new saying
      const currentValues = sheetData?.values || [];
      const newValues = [...currentValues, [data.text, data.imagePrompt]];
      
      // Update the Google Sheet
      await updateSheet(newValues);
      
      // Call the optional callback if provided
      if (onAddSaying) {
        onAddSaying(data);
      }
      
      // Reset the form
      reset();
    } catch (error) {
      console.error('Error adding saying:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Add a New Ridiculous Saying
    </h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          What did they say?
        </label>
        <textarea id="text" {...register('text', {
          required: 'Please enter what Courtney said',
          minLength: {
            value: 3,
            message: 'Saying must be at least 3 characters'
          }
        })} className={`w-full px-3 py-2 border rounded-md ${errors.text ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`} rows={3} placeholder="Enter the ridiculous saying here..." />
        {errors.text && <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircleIcon className="w-4 h-4 mr-1" />
          {errors.text.message}
        </p>}
      </div>
      <div>
        <label htmlFor="imagePrompt" className="block text-sm font-medium text-gray-700 mb-1">
          Image Prompt
        </label>
        <input type="text" id="imagePrompt" {...register('imagePrompt', {
          required: 'Please provide an image prompt',
          minLength: {
            value: 3,
            message: 'Prompt must be at least 3 characters'
          }
        })} className={`w-full px-3 py-2 border rounded-md ${errors.imagePrompt ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`} placeholder="Describe an image that matches the saying..." />
        {errors.imagePrompt && <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircleIcon className="w-4 h-4 mr-1" />
          {errors.imagePrompt.message}
        </p>}
        <p className="mt-1 text-xs text-gray-500">
          Tip: Be descriptive with your prompt to get a relevant image
        </p>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}>
          {isSubmitting ? 'Adding...' : 'Add Saying'}
        </button>
      </div>
    </form>
  </div>;
};