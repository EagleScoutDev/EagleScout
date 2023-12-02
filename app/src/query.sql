DECLARE
    curr_report scout_reports;
BEGIN
    -- check if there exists a scout report with the given id
    SELECT * INTO curr_report FROM scout_reports WHERE id = report_id_arg;
    IF curr_report IS NULL THEN
       RAISE EXCEPTION 'Scout report not found';
    END IF;
    -- update the scout report
    UPDATE scout_reports
    SET data=data_arg
    WHERE id = report_id_arg;
    -- if there is no past/initial edit history for this report, create one as an initial edit
    IF NOT EXISTS (SELECT 1 FROM scout_reports_edits WHERE scout_report_id = report_id_arg) THEN
       INSERT INTO scout_reports_edits (edited_by_id, scout_report_id, data) VALUES (curr_report.user_id, report_id_arg, curr_report.data);
    END IF;
    -- create a new edit history entry for this edit
    INSERT INTO scout_reports_edits (edited_by_id, scout_report_id, data)
    VALUES (auth.uid(), report_id_arg, data_arg);
END;
