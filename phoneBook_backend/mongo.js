const mongoose = require('mongoose');

// Get command line arguments
const args = process.argv.slice(2);

if(args.length < 1){
  console.log('Please provide the password as an argument');
  process.exit(1);
}

// Destructure the arguments
const [password, name, number] = args;

console.log(args)



// Disable strict query mode
mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB'); 
 })
 .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

   const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();  
      delete returnedObject._id;
      delete returnedObject.__v;
    } 
  })

  // Create a model based on the schema
const Person = mongoose.model('Person', noteSchema);

if (!name || !number) {
    return Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
        })
    mongoose.connection.close();  
})
}
else {

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} number: ${savedPerson.number} to phonebook`);
    mongoose.connection.close();
  })
  
} 

 



 