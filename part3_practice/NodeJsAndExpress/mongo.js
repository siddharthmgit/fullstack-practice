const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb://dbuser:${password}@ac-fkp9t0p-shard-00-00.bkyrfsw.mongodb.net:27017,ac-fkp9t0p-shard-00-01.bkyrfsw.mongodb.net:27017,ac-fkp9t0p-shard-00-02.bkyrfsw.mongodb.net:27017/?ssl=true&replicaSet=atlas-cukc3r-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is easy',
    important: true,
})

note.save().then(result => {
    console.log('note saved!')
})

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})