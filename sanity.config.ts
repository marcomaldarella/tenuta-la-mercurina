'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './lib/sanity/client'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'tenuta-la-mercurina',
  title: 'Tenuta La Mercurina',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
