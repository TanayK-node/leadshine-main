-- Create a function to get admin users with their emails
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role app_role,
  is_root BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  email TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.is_root,
    ur.created_at,
    COALESCE(au.email, 'Unknown') as email
  FROM user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
$$;

-- Create a function to add an admin by email (only callable by root admins)
CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  result JSON;
BEGIN
  -- Check if caller is root admin
  IF NOT public.is_root_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Only root admins can add other admins');
  END IF;

  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found with this email');
  END IF;

  -- Check if already an admin
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'User is already an admin');
  END IF;

  -- Add admin role
  INSERT INTO user_roles (user_id, role, is_root)
  VALUES (target_user_id, 'admin', false);

  RETURN json_build_object('success', true, 'message', 'Admin added successfully');
END;
$$;

COMMENT ON FUNCTION public.get_admin_users IS 'Security definer function to get list of admin users with their emails';
COMMENT ON FUNCTION public.add_admin_by_email IS 'Security definer function for root admins to add new admins by email';