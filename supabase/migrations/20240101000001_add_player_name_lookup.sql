-- Function to get user email by player name
-- This allows username-based authentication by looking up the associated email
CREATE OR REPLACE FUNCTION get_user_email_by_player_name(player_name_param TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Find the user_id associated with the player name
    SELECT auth.users.email INTO user_email
    FROM players
    JOIN auth.users ON players.user_id = auth.users.id
    WHERE players.name = player_name_param;
    
    RETURN user_email;
END;
$$;
