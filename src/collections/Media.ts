import { APIError, type CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiError } from 'next/dist/server/api-utils'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { Import } from 'lucide-react'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'originalFilename',
      type: 'text',
      label: 'Original Filename',
      admin:{
        hidden: true,
      }
    },
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data && data.originalFilename) {
            const existingMedia = await req.payload.find({
              collection: 'media',
              where: {
                originalFilename: { equals: data.originalFilename },
              },
            });
    
            // Nếu ảnh đã tồn tại và không phải ảnh hiện tại thì báo lỗi
            if (existingMedia.totalDocs > 0) {
              const isSameImage = existingMedia.docs.some(
                (doc) => doc.id === data.id // Kiểm tra xem ảnh này có phải ảnh hiện tại không
              );
    
              if (!isSameImage) {
                throw new APIError('Ảnh này đã tồn tại trong hệ thống! Vui lòng chọn ảnh khác.', 400);
              }
            }
          }
        }
      },
    ],
    
  },
  
}
