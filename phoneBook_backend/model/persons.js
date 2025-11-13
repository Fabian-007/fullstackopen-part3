const mongoose = require('mongoose');

// Disable strict query mode
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB'); 
 })
 .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });
  
  // Define the schema for a person
   const noteSchema = new mongoose.Schema({
    name: {
    type: String,
    minlength: 3,
    required: true
    },
    number:{ 
    type: String,
    minlength:10,
    // custom validation for phone number format
    validate : {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v); //regex to match format XX-XXXXXXX or XXX-XXXXXXX
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
    }
  });

  // Customize the JSON representation of the documents
  noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();  
      delete returnedObject._id;
      delete returnedObject.__v;
    } 
  })

  // Create a model based on the schema
module.exports =  mongoose.model('Person', noteSchema);