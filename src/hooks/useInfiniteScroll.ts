// hooks/useInfiniteScroll.ts
import { useEffect } from 'react';

const useInfiniteScroll = (fetchMore: () => void) => {
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100
            ) {
                fetchMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchMore]);
};

export default useInfiniteScroll;