const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder')

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Please add a store ID'],
    unique: true,
    trim:true,
    maxlength: [10, 'Store ID must be less than 10 char']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  }
},
{ 
  timestamps: true 
}
);

//Geocode and create location (pre=executed before)(Minddleware)
StoreSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  }

  //dont save actual address
  this.address = undefined;
  next()
})

module.exports = mongoose.model('Store', StoreSchema);

// module.exports = mongoose.model('StoreLocator', StoreSchema);