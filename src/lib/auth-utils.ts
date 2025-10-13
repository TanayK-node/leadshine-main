import { supabase } from "@/integrations/supabase/client";

export const checkAuth = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const requireAuth = async (onSuccess: () => void, onError: () => void) => {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    onSuccess();
  } else {
    onError();
  }
};
