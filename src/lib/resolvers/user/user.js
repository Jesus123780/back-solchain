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