const mongoose = require('mongoose');
const service = require('feathers-mongoose');

module.exports = function createService(name, schemaOptions) {
  const schema = new mongoose.Schema(schemaOptions);
  
  schema.set('timestamps', true);
  
  const Model = mongoose.model(name, schema);
  
  const setOptions = (context) => {
    context.params.mongoose = {
      runValidators: true,
      setDefaultsOnInsert: true,
    };
  };
  
  return (app)  => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    app.use('/' + name, service({
      Model,
      lean: true,
    }));
  
    app.service(name).hooks({
      before: {
        create: setOptions,
        update: setOptions,
        patch: setOptions,
      },
    });
  };
  
}
