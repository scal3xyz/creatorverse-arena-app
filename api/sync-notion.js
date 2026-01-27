const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');

// Initialize clients
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Helper: Get text from Notion property
function getNotionText(property) {
  if (!property) return null;
  switch (property.type) {
    case 'title': return property.title?.[0]?.plain_text || null;
    case 'rich_text': return property.rich_text?.[0]?.plain_text || null;
    case 'email': return property.email || null;
    case 'url': return property.url || null;
    case 'number': return property.number || 0;
    case 'select': return property.select?.name || null;
    case 'multi_select': return property.multi_select?.map(s => s.name) || [];
    case 'status': return property.status?.name || null;
    default: return null;
  }
}

// Helper: Extract Twitter handle
function extractTwitterHandle(twitter) {
  if (!twitter) return null;
  return twitter
    .replace(/https?:\/\/(www\.)?(twitter|x)\.com\//gi, '')
    .replace(/\/$/, '')
    .replace('@', '')
    .trim() || null;
}

// Helper: Map tier names
function mapTier(tier) {
  const tierMap = { 'diamond': 'Diamond', 'platinum': 'Platinum', 'gold': 'Gold', 'silver': 'Silver', 'bronze': 'Bronze' };
  return tierMap[tier?.toLowerCase()] || 'Bronze';
}

module.exports = async function handler(req, res) {
  const startTime = Date.now();
  const log = [];
  
  try {
    log.push(`[${new Date().toISOString()}] Starting Notion → Supabase sync...`);
    
    // Fetch approved creators from Notion
    const creators = [];
    let cursor = undefined;
    
    do {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: { property: 'Status', status: { equals: 'Approved' } },
        start_cursor: cursor
      });
      
      for (const page of response.results) {
        const props = page.properties;
        const creator = {
          notion_id: page.id,
          name: getNotionText(props['Name']),
          email: getNotionText(props['Email']),
          handle: extractTwitterHandle(getNotionText(props['Twitter'])),
          tier: mapTier(getNotionText(props['Tier'])),
          status: 'Active',
          telegram: getNotionText(props['Telegram']),
          twitter_followers: getNotionText(props['Twitter Followers']) || 0,
          kaito_smart_followers: getNotionText(props['Kaito Smart Followers']) || 0,
          cookie3_smart_followers: getNotionText(props['Cookie3 Smart Followers']) || 0,
          region: getNotionText(props['Region']),
          country: getNotionText(props['Country']),
          content_type: getNotionText(props['Content Type']),
          ecosystems: getNotionText(props['Ecosystems']) || [],
          referral: getNotionText(props['Referral']),
          avatar: '👤',
          total_earned: 0,
          is_admin: false
        };
        
        if (creator.email && creator.name && creator.handle) {
          creators.push(creator);
        }
      }
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    
    log.push(`Found ${creators.length} approved creators in Notion`);
    
    // Sync to Supabase
    let created = 0, updated = 0, unchanged = 0, errors = 0;
    
    for (const creator of creators) {
      try {
        // Check if exists by notion_id or email
        const { data: existing } = await supabase
          .from('creators')
          .select('id, notion_id, name, email, handle, tier, wallet')
          .or(`notion_id.eq.${creator.notion_id},email.eq.${creator.email}`)
          .maybeSingle();
        
        if (existing) {
          // Check if anything changed (except wallet - never overwrite that)
          const hasChanges = 
            existing.name !== creator.name ||
            existing.handle !== creator.handle ||
            existing.tier !== creator.tier;
          
          if (hasChanges) {
            // Update but preserve wallet
            const { error } = await supabase
              .from('creators')
              .update({
                ...creator,
                wallet: existing.wallet // Keep existing wallet
              })
              .eq('id', existing.id);
            
            if (error) throw error;
            updated++;
          } else {
            unchanged++;
          }
        } else {
          // Create new creator
          const { error } = await supabase
            .from('creators')
            .insert(creator);
          
          if (error) throw error;
          created++;
          log.push(`+ New creator: ${creator.name} (@${creator.handle})`);
        }
      } catch (err) {
        log.push(`✗ Error with ${creator.email}: ${err.message}`);
        errors++;
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log.push(`✅ Done in ${duration}s: ${created} new, ${updated} updated, ${unchanged} unchanged, ${errors} errors`);
    
    return res.status(200).json({
      success: true,
      duration: `${duration}s`,
      stats: { created, updated, unchanged, errors },
      log
    });
    
  } catch (err) {
    log.push(`❌ Sync failed: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: err.message,
      log
    });
  }
};
