import { Schema, model } from 'mongoose';
import { ICollection } from '../interfaces';

const collectionSchema = new Schema<ICollection>(
  {
    name: {
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
)

const Collection = model<ICollection>('Collection', collectionSchema)

export default Collection
