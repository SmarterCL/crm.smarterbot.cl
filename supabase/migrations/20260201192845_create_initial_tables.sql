-- Create initial tables for CRM
-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    company text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    event_type text NOT NULL DEFAULT 'meeting',
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Event participants table
CREATE TABLE IF NOT EXISTS public.event_participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
    email text,
    name text,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON public.calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_client_id ON public.event_participants(client_id);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.calendar_events FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.calendar_events FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.event_participants FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.event_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.event_participants FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.event_participants FOR DELETE USING (true);