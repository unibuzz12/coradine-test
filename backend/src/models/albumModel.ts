import { Schema, model } from 'mongoose';
import { IAlbum } from '../interfaces';

const albumSchema = new Schema<IAlbum>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    collection_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

const Album = model<IAlbum>('Album', albumSchema)

export default Album
