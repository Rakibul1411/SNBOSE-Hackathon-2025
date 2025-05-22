-- Create spaces table
CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create space_members table
CREATE TABLE IF NOT EXISTS public.space_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(space_id, user_id)
);

-- Create space_subscription table
CREATE TABLE IF NOT EXISTS public.space_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(space_id, user_id)
);

-- Create RLS policies for spaces
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spaces are viewable by everyone"
    ON public.spaces FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create spaces"
    ON public.spaces FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own spaces"
    ON public.spaces FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own spaces"
    ON public.spaces FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Create RLS policies for space_members
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Space members are viewable by everyone"
    ON public.space_members FOR SELECT
    USING (true);

CREATE POLICY "Space admins can manage members"
    ON public.space_members FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.space_members
            WHERE space_id = space_members.space_id
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create RLS policies for space_subscription
ALTER TABLE public.space_subscription ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscriptions"
    ON public.space_subscription FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can subscribe"
    ON public.space_subscription FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe"
    ON public.space_subscription FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update members count
CREATE OR REPLACE FUNCTION public.update_space_members_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.spaces
        SET members_count = members_count + 1
        WHERE id = NEW.space_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.spaces
        SET members_count = members_count - 1
        WHERE id = OLD.space_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for members count
CREATE TRIGGER update_space_members_count
    AFTER INSERT OR DELETE ON public.space_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_space_members_count(); 