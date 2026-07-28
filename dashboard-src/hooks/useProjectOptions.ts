import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@dashboard/constants';
import { projectsService } from '@dashboard/services';
import { Project } from '@dashboard/types';

/**
 * The full project list used to populate dropdowns (filters, create/edit forms,
 * report modals). Every caller shares one cache entry so React Query issues a
 * single request instead of one per component — the API allows only 100 requests
 * per 15 minutes per IP, and these dropdowns appear several times per page.
 *
 * Creating or editing a project invalidates the ADMIN_PROJECTS prefix, so this
 * still refreshes when the underlying list actually changes.
 */
export function useProjectOptions(enabled = true) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS, 'options'],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  const projects: Project[] = data?.projects ?? [];
  return { projects, isLoading };
}
