import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // simulate 2s loading

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            router.visit('/login'); // redirect to login after loading
        }
    }, [isLoading]);

    return (
        <div className="w-full relative min-h-screen">
            <AnimatePresence>
                {
                    isLoading && (
                        <motion.div
                            className="flex justify-center items-center min-h-screen absolute inset-0 bg-white z-50"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.8 }}
                        >
                            Fnb Logo
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
}
