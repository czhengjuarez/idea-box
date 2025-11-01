import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)
const IDEAS_KEY = 'ideas.json'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // Redirect favicon.ico to favicon.svg
    if (url.pathname === '/favicon.ico') {
      return Response.redirect(url.origin + '/favicon.svg', 301)
    }
    
    // API endpoints for ideas
    if (url.pathname === '/api/ideas') {
      return handleIdeasAPI(request, env)
    }
    
    // Serve static assets
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          mapRequestToAsset: req => {
            // Handle SPA routing - serve index.html for all routes
            const url = new URL(req.url)
            if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
              return new Request(`${url.origin}/index.html`, req)
            }
            return req
          }
        }
      )
    } catch (e) {
      // If asset not found, serve index.html (for SPA routing)
      try {
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
            mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
          }
        )
      } catch (e) {
        return new Response(`Not Found: ${e.message}`, { status: 404 })
      }
    }
  }
}

async function handleIdeasAPI(request, env) {
  const bucket = env.IDEA_BOX_STORAGE
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    if (request.method === 'GET') {
      // Get ideas from R2
      const object = await bucket.get(IDEAS_KEY)
      
      if (object === null) {
        // Return empty array if no data exists
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const ideas = await object.text()
      return new Response(ideas, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (request.method === 'POST') {
      // Save ideas to R2
      const ideas = await request.json()
      
      await bucket.put(IDEAS_KEY, JSON.stringify(ideas), {
        httpMetadata: { contentType: 'application/json' }
      })
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
