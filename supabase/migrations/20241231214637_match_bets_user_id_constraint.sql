alter table match_bets
    add constraint fk_user_id foreign key (user_id) references public.profiles (id);
