const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET



const resolvers = {
    Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        {
          const filter = {};
          
          if (args.author) {
            const author = await Author.findOne({ name: args.author });
            if (!author) {
              return [];
            }
            filter.author = author._id;
          }
          
          if (args.genre) {
            filter.genres = { $in: [args.genre] };
          }
          
          return await Book.find(filter).populate('author');
        }
      },
      allAuthors: async () => {
        return Author.find({}) 
      },
  
      me: (root, args, context) => {
        return context.currentUser
      },
    },
  
    Author: {
      bookCount: async (root) => {
        const author = await Author.findOne({ name: root.name })
        const books = await Book.find({ author: author._id })
        return books.length
      } 
    },
  
    Book: {
      author: async (root) => {
        const author = await Author.findById( root.author )
        return author
      }
    },
  
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED'
            }
          
          })
        }
  
        let author = await Author.findOne({ name: args.author })
  
        if(!author) {
          author = new Author({ name: args.author })
          try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('Saving author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
            }
          })
        }
      }
        const book = new Book({ ...args, author: author })
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
          }
        })
        
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    
    },
  
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED'
            }
          })
        }
  
        const author = await Author.findOne({ name: args.name })
        author.born = args.setBornTo
        
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
          }
        })
      }
      return author
    },
  
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      
      return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },
  
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username})
  
      if (!user || args.password !== 'password') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
  
      const userForToken = {
        username: user.username,
        id: user._id
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
    
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
  }

  module.exports = resolvers
