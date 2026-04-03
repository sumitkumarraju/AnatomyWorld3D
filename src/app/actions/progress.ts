'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Hardcoded reference to compute progress percentage dynamically.
// You can move this to a database table like `modules` later.
const MODULE_DEFINITIONS = [
  { id: '1', title: 'Cardiovascular System', trackableEntities: ['heart', 'vascular_system'] },
  { id: '2', title: 'Respiratory System', trackableEntities: ['lungs', 'diaphragm'] },
  { id: '3', title: 'Nervous System', trackableEntities: ['brain'] },
  { id: '4', title: 'Skeletal System', trackableEntities: ['ribcage', 'spine'] },
  { id: '5', title: 'Digestive System', trackableEntities: ['stomach', 'liver', 'intestines', 'pancreas', 'esophagus'] },
  { id: '6', title: 'Urinary System', trackableEntities: ['kidney', 'bladder'] },
];

export async function logUserActivity(
  actionType: string,
  entityId: string,
  entityTitle: string,
  moduleId: string
) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('No valid user session:', userError?.message);
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_activity_log')
    .insert({
      user_id: user.id,
      action_type: actionType,
      entity_id: entityId,
      entity_title: entityTitle,
      module_id: moduleId
    });

  if (error) {
    console.error('Failed to log activity:', error);
    return { success: false, error: error.message };
  }

  // Tell Next.js we updated progress data, refresh the dashboard
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getDashboardData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      activities: [],
      modulesProgress: MODULE_DEFINITIONS.map(mod => ({
        id: mod.id,
        title: mod.title,
        progress: 0
      }))
    };
  }

  // 1. Get recent activity feed (limit to 5)
  const { data: recentActivities } = await supabase
    .from('user_activity_log')
    .select('action_type, entity_title, module_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // 2. Compute Progress Percentages per module
  // Fetch ALL unique entity_id's the user has explored per module
  // To avoid fetching thousands of rows, group by module_id and entity_id would be better,
  // but for simplicity we fetch the distinct combinations.
  // Instead of raw sql, we'll fetch them, or do it with Edge Functions,
  // but for v1 simply pulling the limited needed identifiers works.
  const { data: uniqueEntities } = await supabase
    .from('user_activity_log')
    .select('module_id, entity_id')
    .eq('user_id', user.id)
    .eq('action_type', 'EXPLORED_ORGAN'); // only count organs they explored towards progress

  // Deduplicate on JS side
  const exploredSet = new Set<string>();
  uniqueEntities?.forEach(row => {
    exploredSet.add(`${row.module_id}:${row.entity_id}`);
  });

  const modulesProgress = MODULE_DEFINITIONS.map(mod => {
    // Count how many from trackableEntities are in the exploredSet
    const exploredCount = mod.trackableEntities.reduce((acc, entity) => {
      if (exploredSet.has(`${mod.id}:${entity}`)) return acc + 1;
      return acc;
    }, 0);

    const percent = Math.round((exploredCount / mod.trackableEntities.length) * 100);

    return {
      id: mod.id,
      title: mod.title,
      progress: percent
    };
  });

  return {
    activities: recentActivities || [],
    modulesProgress
  };
}
