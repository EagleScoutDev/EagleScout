DROP FUNCTION IF EXISTS register_user_with_organization(organization_number integer);

create policy "Enable insert for authenticated users only"
    on "public"."organizations"
    for insert to authenticated
    with check (true);

CREATE OR REPLACE FUNCTION register_user_with_organization(
    team_number INT
) RETURNS TEXT AS
$$
DECLARE
    existing_organization_id   INTEGER;
    selected_organization_id   INTEGER;
    selected_organization_name TEXT;
    return_value               TEXT;
BEGIN
    SELECT organization_id
    INTO existing_organization_id
    FROM public.user_attributes
    WHERE id = auth.uid();

    IF existing_organization_id IS NOT NULL THEN
        RAISE EXCEPTION 'User is already registered with a organization';
    END IF;

    IF EXISTS (SELECT id
               FROM public.organizations
               WHERE number = team_number) THEN
        SELECT id
        INTO selected_organization_id
        FROM public.organizations
        WHERE number = team_number;

        SELECT 'team-exists' INTO return_value;
    ELSE
        SELECT number, name
        INTO selected_organization_id, selected_organization_name
        FROM public.tba_teams
        WHERE number = team_number;

        INSERT INTO public.organizations (number, name)
        VALUES (selected_organization_id, selected_organization_name)
        RETURNING id INTO selected_organization_id;

        SELECT 'team-created' INTO return_value;
    END IF;

    UPDATE public.user_attributes
    SET (organization_id, scouter, admin) = (selected_organization_id, FALSE, FALSE)
    WHERE id = auth.uid();

    RETURN return_value;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.organizations
    ADD COLUMN email TEXT
        DEFAULT NULL;
