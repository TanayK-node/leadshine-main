-- Add is_root column to user_roles table
ALTER TABLE public.user_roles
ADD COLUMN is_root BOOLEAN NOT NULL DEFAULT false;

-- Create function to check if current user is root admin
CREATE OR REPLACE FUNCTION public.is_root_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
      AND is_root = true
  )
$$;

-- Grant admin privileges to admin@gmail.com as root admin
INSERT INTO public.user_roles (user_id, role, is_root)
SELECT id, 'admin'::app_role, true
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (user_id, role) 
DO UPDATE SET is_root = true;

COMMENT ON COLUMN public.user_roles.is_root IS 'Indicates if this admin is a root admin who can manage other admins';
COMMENT ON FUNCTION public.is_root_admin IS 'Security definer function to check if current user is root admin';