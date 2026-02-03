-- Fix clients table by adding missing columns
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_interaction timestamp with time zone;

-- Ensure indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_last_interaction ON public.clients(last_interaction);
