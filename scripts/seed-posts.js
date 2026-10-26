/**
 * Migration & Seeding Script: Seed Posts into Strapi CMS with Dynamic Zones
 * 
 * Usage:
 *   node scripts/seed-posts.js
 *   node scripts/seed-posts.js path/to/posts.json
 */

const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function findPostsJsonPath() {
  const candidates = [
    process.argv[2],
    path.resolve(__dirname, '../../blog-nextjs/src/data/posts.json'),
    path.resolve(__dirname, '../data/posts.json'),
    path.resolve(process.cwd(), '../blog-nextjs/src/data/posts.json'),
    path.resolve(process.cwd(), 'src/data/posts.json'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function findOrUploadMedia(app, filename, caption, altText) {
  try {
    const existing = await app.db.query('plugin::upload.file').findOne({
      where: { name: filename },
    });
    if (existing) {
      return existing;
    }

    const possiblePaths = [
      path.resolve(__dirname, '../../blog-nextjs/public/images', filename),
      path.resolve(process.cwd(), '../blog-nextjs/public/images', filename),
      path.resolve(process.cwd(), 'public/images', filename),
    ];

    let sourcePath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        sourcePath = p;
        break;
      }
    }

    if (!sourcePath) {
      return null;
    }

    const uploadService = app.plugin('upload').service('upload');
    const stat = fs.statSync(sourcePath);

    try {
      await uploadService.upload({
        data: {
          fileInfo: {
            name: filename,
            caption: caption || filename,
            alternativeText: altText || filename,
          },
        },
        files: {
          filepath: sourcePath,
          originalFilename: filename,
          mimetype: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
          size: stat.size,
        },
      });
    } catch (err) {
      // Ignore temporary file cleanup locks on Windows
    }

    return await app.db.query('plugin::upload.file').findOne({
      where: { name: filename },
    });
  } catch (err) {
    console.warn(`[Seed] Warning: Could not upload media ${filename}:`, err.message);
    return null;
  }
}

function buildPost20Blocks(post, archDiagramMedia, cicdDiagramMedia) {
  const rawContent = post.content || '';
  const sections = rawContent.split(/(?=^##\s)/m);

  // Section 0: Intro, Section 1: ## Why Cloudflare Workers?
  const introText = [sections[0], sections[1]].filter(Boolean).join('\n\n');
  // Section 2: ## Prerequisites, Section 3: ## Step 1 — Install vinext and dependencies
  const step1Text = [sections[2], sections[3]].filter(Boolean).join('\n\n');
  // Section 4 onwards: remaining sections
  const remainingText = sections.slice(4).join('\n\n');

  const blocks = [
    {
      __component: 'blocks.hero',
      shortDescription:
        post.excerpt ||
        'Everything you need to go from a local Next.js App Router project to a globally distributed Cloudflare Workers deployment — with vinext, Vite, custom domains, and CI/CD.',
      author: post.author || 'Ajay',
      readMinutes: post.minutes || 18,
      topic: post.topic || 'How-to',
    },
    {
      __component: 'blocks.video',
      url: post.youtubeUrl || 'https://youtu.be/HwLOaYEMoMA?si=lVSH6vU4n_5sSVar',
      title: 'Cloudflare Workers Video Tutorial',
      caption: 'Step-by-step walkthrough: Deploying Next.js to Cloudflare Workers with vinext',
    },
    {
      __component: 'blocks.rich-text',
      body: introText,
    },
    {
      __component: 'blocks.diagram-image',
      caption: 'Next.js to Cloudflare Workers Architecture Overview',
      altText: 'Architecture diagram showing Next.js compilation through vinext to Cloudflare Workers',
      ...(archDiagramMedia ? { image: archDiagramMedia.id } : {}),
    },
    {
      __component: 'blocks.command-block',
      command: 'npx wrangler login',
      shell: 'bash',
      description: 'Log in to your Cloudflare account',
    },
    {
      __component: 'blocks.rich-text',
      body: step1Text,
    },
    {
      __component: 'blocks.code-block',
      filename: 'vite.config.ts',
      language: 'typescript',
      code: `import { defineConfig } from "vite";
import { vinext } from "vinext/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { rsc } from "@vitejs/plugin-rsc";

export default defineConfig({
  plugins: [
    vinext({
      // Tells vinext this is an App Router project
      appRouter: true,
    }),
    cloudflare(),
    rsc(),
  ],
});`,
    },
    {
      __component: 'blocks.diagram-image',
      caption: 'Automated GitHub Actions CI/CD Pipeline to Cloudflare Workers',
      altText: 'Automated GitHub Actions CI/CD Pipeline to Cloudflare Workers',
      ...(cicdDiagramMedia ? { image: cicdDiagramMedia.id } : {}),
    },
    {
      __component: 'blocks.rich-text',
      body: remainingText,
    },
  ];

  return blocks;
}

function buildStandardBlocks(post) {
  const blocks = [];

  // 1. Hero Block
  blocks.push({
    __component: 'blocks.hero',
    shortDescription: post.excerpt || post.title,
    author: post.author || 'Ajay',
    readMinutes: post.minutes || 10,
    topic: post.topic || 'How-to',
  });

  // 2. Video Block (if present)
  if (post.youtubeUrl) {
    blocks.push({
      __component: 'blocks.video',
      url: post.youtubeUrl,
      title: 'Video Tutorial',
      caption: post.title,
    });
  }

  // 3. Rich Text Block
  if (post.content) {
    blocks.push({
      __component: 'blocks.rich-text',
      body: post.content,
    });
  }

  return blocks;
}

async function seedPosts() {
  const postsPath = await findPostsJsonPath();
  if (!postsPath) {
    console.error('Error: Could not find posts.json file.');
    console.error('Searched standard locations. Please specify the path as an argument:');
    console.error('  node scripts/seed-posts.js <path-to-posts.json>');
    process.exit(1);
  }

  console.log(`[Seed] Reading posts from: ${postsPath}`);
  const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  console.log(`[Seed] Found ${postsData.length} posts to seed.`);

  console.log('[Seed] Initializing Strapi CMS instance...');
  const app = await createStrapi({ distDir: './dist' }).load();

  try {
    // 1. Find or upload diagram media assets
    console.log('[Seed] Verifying diagram media assets in Strapi Media Library...');
    const archDiagram = await findOrUploadMedia(
      app,
      'cf-architecture-diagram.jpg',
      'Next.js to Cloudflare Workers Architecture Overview',
      'Architecture diagram showing Next.js compilation through vinext to Cloudflare Workers'
    );
    const cicdDiagram = await findOrUploadMedia(
      app,
      'cicd-pipeline-diagram.jpg',
      'Automated GitHub Actions CI/CD Pipeline to Cloudflare Workers',
      'Automated GitHub Actions CI/CD Pipeline to Cloudflare Workers'
    );

    if (archDiagram) console.log(`  ✓ Architecture diagram ready (id: ${archDiagram.id})`);
    if (cicdDiagram) console.log(`  ✓ CI/CD diagram ready (id: ${cicdDiagram.id})`);

    // 2. Iterate and seed each post
    const docService = app.documents('api::post.post');
    let createdCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < postsData.length; i++) {
      const post = postsData[i];
      const isPost20 = post.id === 20 || post.slug.includes('cloudflare-workers');

      let blocks;
      if (post.blocks && Array.isArray(post.blocks) && post.blocks.length > 0) {
        blocks = post.blocks;
      } else if (isPost20) {
        blocks = buildPost20Blocks(post, archDiagram, cicdDiagram);
      } else {
        blocks = buildStandardBlocks(post);
      }

      const postPayload = {
        title: post.title,
        slug: post.slug,
        topic: post.topic || 'How-to',
        tags: post.tags || [],
        featured: Boolean(post.featured),
        publishedAt: post.publishedAt || post.date || new Date().toISOString(),
        blocks: blocks,
      };

      // Check if entry with slug already exists
      const existing = await docService.findFirst({
        filters: { slug: post.slug },
      });

      if (existing) {
        await docService.update({
          documentId: existing.documentId,
          data: postPayload,
          status: 'published',
        });
        updatedCount++;
        console.log(`  [${i + 1}/${postsData.length}] Updated: "${post.title}" (slug: ${post.slug})`);
      } else {
        await docService.create({
          data: postPayload,
          status: 'published',
        });
        createdCount++;
        console.log(`  [${i + 1}/${postsData.length}] Created: "${post.title}" (slug: ${post.slug})`);
      }
    }

    console.log('\n[Seed] Complete!');
    console.log(`  Created: ${createdCount} posts`);
    console.log(`  Updated: ${updatedCount} posts`);
    console.log(`  Total:   ${createdCount + updatedCount} posts in Strapi CMS.`);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  } finally {
    console.log('[Seed] Shutting down Strapi instance...');
    await app.destroy();
  }
}

seedPosts()
  .then(() => {
    console.log('[Seed] Seeding finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Seed] Fatal error:', err);
    process.exit(1);
  });
