const arr = [
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling'
    },
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling'
    },
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling'
    },
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling'
    },
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling'
    }
]
const books = async (_, args, { res }) => {
    res.cookie('access', 'Lol', { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
    return arr
}
export default {
    TYPES: {
    },
    QUERIES: {
        books
    },
    MUTATIONS: {
    }
}