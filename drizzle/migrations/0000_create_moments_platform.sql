CREATE TYPE public.event_status AS ENUM ('lead', 'onboarding', 'active', 'closed');
CREATE TYPE public.rsvp_status AS ENUM ('pending', 'confirmed', 'declined');
CREATE TYPE public.app_role AS ENUM ('admin', 'couple');

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  couple_names text,
  contact_name text,
  estimated_guests integer,
  event_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  locations jsonb NOT NULL DEFAULT '[]'::jsonb,
  template_id text NOT NULL DEFAULT 'classic-dark',
  status public.event_status NOT NULL DEFAULT 'lead',
  rsvp_deadline date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT INSERT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.event_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT ON public.event_members TO authenticated;
GRANT ALL ON public.event_members TO service_role;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  phone text,
  access_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  rsvp_status public.rsvp_status NOT NULL DEFAULT 'pending',
  is_attending boolean,
  invitation_sent boolean NOT NULL DEFAULT false,
  dietary_requirements text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sub_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_guest_id uuid NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  is_attending boolean,
  dietary_requirements text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sub_guests TO authenticated;
GRANT ALL ON public.sub_guests TO service_role;
ALTER TABLE public.sub_guests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.can_access_event(_event_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.event_members WHERE event_id = _event_id AND user_id = auth.uid()
  )
$$;
GRANT EXECUTE ON FUNCTION public.can_access_event(uuid) TO authenticated;

CREATE POLICY "Public can submit leads" ON public.events FOR INSERT TO anon, authenticated
WITH CHECK (status = 'lead' AND owner_id IS NULL);
CREATE POLICY "Members can read events" ON public.events FOR SELECT TO authenticated
USING (public.can_access_event(id));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());
CREATE POLICY "Members can read memberships" ON public.event_members FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Event users can read guests" ON public.guests FOR SELECT TO authenticated
USING (public.can_access_event(event_id));
CREATE POLICY "Admins can insert guests" ON public.guests FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update guests" ON public.guests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete guests" ON public.guests FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Event users can read sub guests" ON public.sub_guests FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.guests g WHERE g.id = parent_guest_id AND public.can_access_event(g.event_id)));
CREATE POLICY "Admins can insert sub guests" ON public.sub_guests FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sub guests" ON public.sub_guests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sub guests" ON public.sub_guests FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX events_owner_id_idx ON public.events(owner_id);
CREATE INDEX events_status_idx ON public.events(status);
CREATE INDEX guests_event_id_idx ON public.guests(event_id);
CREATE INDEX sub_guests_parent_id_idx ON public.sub_guests(parent_guest_id);
CREATE INDEX event_members_user_id_idx ON public.event_members(user_id);

CREATE OR REPLACE FUNCTION public.get_invitation(_slug text, _token uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'event', jsonb_build_object('id', e.id, 'title', e.title, 'slug', e.slug, 'couple_names', e.couple_names, 'event_dates', e.event_dates, 'locations', e.locations, 'template_id', e.template_id, 'status', e.status, 'rsvp_deadline', e.rsvp_deadline),
    'guest', jsonb_build_object('id', g.id, 'first_name', g.first_name, 'rsvp_status', g.rsvp_status, 'is_attending', g.is_attending, 'dietary_requirements', g.dietary_requirements),
    'sub_guests', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'full_name', s.full_name, 'is_attending', s.is_attending, 'dietary_requirements', s.dietary_requirements) ORDER BY s.created_at) FROM public.sub_guests s WHERE s.parent_guest_id = g.id), '[]'::jsonb)
  )
  FROM public.events e JOIN public.guests g ON g.event_id = e.id
  WHERE e.slug = _slug AND g.access_token = _token
$$;
GRANT EXECUTE ON FUNCTION public.get_invitation(text, uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_household_rsvp(_slug text, _token uuid, _primary_attending boolean, _dietary text, _sub_guests jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _guest_id uuid;
BEGIN
  SELECT g.id INTO _guest_id FROM public.guests g JOIN public.events e ON e.id = g.event_id WHERE e.slug = _slug AND g.access_token = _token;
  IF _guest_id IS NULL THEN RETURN false; END IF;
  UPDATE public.guests SET is_attending = _primary_attending, rsvp_status = CASE WHEN _primary_attending THEN 'confirmed'::public.rsvp_status ELSE 'declined'::public.rsvp_status END, dietary_requirements = NULLIF(_dietary, ''), updated_at = now() WHERE id = _guest_id;
  UPDATE public.sub_guests s SET is_attending = x.attending, dietary_requirements = NULLIF(x.dietary, '') FROM jsonb_to_recordset(_sub_guests) AS x(id uuid, attending boolean, dietary text) WHERE s.id = x.id AND s.parent_guest_id = _guest_id;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_household_rsvp(text, uuid, boolean, text, jsonb) TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sub_guests;