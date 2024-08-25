import { ALL_BOOKS } from './queries';

export const updateCache = (cache, query, addedBook) => {
    const uniqueByTitle = (a) => {
        let seen = new Set();
        return a.filter((item) => {
            let k = item.title;
            return seen.has(k) ? false : seen.add(k);
        });
    };
    cache.updateQuery({ query: ALL_BOOKS }, (data) => {
        if (!data || !data.allBooks) {
            return { allBooks: [addedBook] };
        }
        return {
            allBooks: uniqueByTitle(data.allBooks.concat(addedBook)),
        };
    });
};
