import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		mediaQuery.addEventListener('change', handleMediaQueryChange);

		setMatches(mediaQuery.matches);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
		};
	}, [query]);

	return matches;
};

export default useMediaQuery;
