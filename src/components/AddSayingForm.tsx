import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { AlertCircleIcon } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      text: '',
      imagePrompt: '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      // Simulate a small delay to show loading state
      setTimeout(() => {
        onAddSaying(value);
        form.reset();
        setIsSubmitting(false);
      }, 500);
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add a New Ridiculous Saying
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="text"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Please enter what your friend said' :
              value.length < 3 ? 'Saying must be at least 3 characters' :
              undefined,
          }}
          children={(field) => (
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                What did they say?
              </label>
              <textarea
                id="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                rows={3}
                placeholder="Enter the ridiculous saying here..."
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircleIcon className="w-4 h-4 mr-1" />
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="imagePrompt"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Please provide an image prompt' :
              value.length < 3 ? 'Prompt must be at least 3 characters' :
              undefined,
          }}
          children={(field) => (
            <div>
              <label htmlFor="imagePrompt" className="block text-sm font-medium text-gray-700 mb-1">
                Image Prompt
              </label>
              <input
                type="text"
                id="imagePrompt"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Describe an image that matches the saying..."
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircleIcon className="w-4 h-4 mr-1" />
                  {field.state.meta.errors[0]}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Tip: Be descriptive with your prompt to get a relevant image
              </p>
            </div>
          )}
        />

        <div className="flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmittingForm]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  !canSubmit || isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors`}
              >
                {isSubmitting ? 'Adding...' : 'Add Saying'}
              </button>
            )}
          />
        </div>
      </form>
    </div>
  );
};