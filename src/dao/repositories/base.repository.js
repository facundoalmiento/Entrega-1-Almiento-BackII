export default class BaseRepository {
  constructor(model) { this.model = model; }
  create(d) { return this.model.create(d); }
  find(f = {}, o = {}) { return this.model.find(f, null, o); }
  findOne(f) { return this.model.findOne(f); }
  findById(id) { return this.model.findById(id); }
  updateOne(f, d) { return this.model.updateOne(f, d); }
  updateById(id, d) { return this.model.findByIdAndUpdate(id, d, { new: true }); }
  deleteOne(f) { return this.model.deleteOne(f); }
  deleteById(id) { return this.model.findByIdAndDelete(id); }
}
