import { createFileRoute } from '@tanstack/react-router'
import courtneyImage from '../assets/courtney.png';
export const Route = createFileRoute('/test')({
    component: App,
})

import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Carousel2 } from '~/components/ui/Carousel2';
import { GoogleSheetRow, useGoogleSheet } from '~/hooks/useGoogleSheet';
import { AddSayingForm } from '~/components/ui/AddSayingForm';
// Define the type for our sayings
export function App() {
    // Initial sample data
    //   const [sayings, setSayings] = useState<Saying[]>([{
    //     id: '1',
    //     text: 'I thought the moon was following me home last night, so I took a different route to lose it.',
    //     imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d1d4bc80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    //   }, {
    //     id: '2',
    //     text: "I don't trust stairs. They're always up to something.",
    //     imageUrl: 'https://images.unsplash.com/photo-1594388384098-8d3fca26fe7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    //   }, {
    //     id: '3',
    //     text: 'I tried to catch fog yesterday. I mist.',
    //     imageUrl: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    //   }]);
    const {
        list,
        error,
    } = useGoogleSheet();
    const addSaying = (newSaying: Omit<GoogleSheetRow, 'id'>) => {
        const id = Date.now().toString();
        // setSayings([...sayings, {
        //     ...newSaying,
        //     id
        // }]);
    };
    const [isFormVisible, setIsFormVisible] = useState(false);
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8 md:mb-12">
                <div className="mb-4 flex justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 relative">
                        <img src={courtneyImage} alt="Cartoon character of my friend" className="w-full h-full object-cover rounded-full border-4 border-indigo-600 shadow-lg" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">
                    Courtney's Sayings
                </h1>
                <p className="text-gray-600">
                    A collection of Courtney's best sayings
                </p>
            </header>
            <main>
                {/* Carousel Section */}
                <section className="mb-12">
                    <Carousel2 sayings={list.map(item => ({
                        id: item.id.toString(),
                        text: item.text,
                        imageUrl: item.imageUrl
                    }))} />
                </section>
                {/* Add New Saying Section */}
                {/* <section>
                    <div className="flex justify-center mb-4">
                        <button onClick={() => setIsFormVisible(!isFormVisible)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all">
                            {isFormVisible ? 'Hide Form' : 'Add New Saying'}
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isFormVisible ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    {isFormVisible && <div className="transition-all duration-300">
                        <AddSayingForm onAddSaying={addSaying} />
                    </div>}
                </section> */}
            </main>
        </div>
    </div>
}