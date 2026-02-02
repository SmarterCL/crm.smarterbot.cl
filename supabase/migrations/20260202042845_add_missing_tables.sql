-- Create missing tables for WhatsApp messages and Statistics
-- WhatsApp messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    direction text NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    content text NOT NULL,
    status text DEFAULT 'sent',
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Statistics table
CREATE TABLE IF NOT EXISTS public.statistics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name text NOT NULL,
    metric_value numeric NOT NULL,
    date_recorded date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_client_id ON public.whatsapp_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_statistics_metric_name ON public.statistics(metric_name);
CREATE INDEX IF NOT EXISTS idx_statistics_date_recorded ON public.statistics(date_recorded);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all for authenticated users" ON public.whatsapp_messages FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.statistics FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.settings FOR ALL USING (true);
