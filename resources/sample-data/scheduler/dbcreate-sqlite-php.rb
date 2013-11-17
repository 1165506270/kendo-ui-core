#!/usr/bin/ruby
require 'csv'

# Switch to CRLF in output
$/ = "\r\n"

YEARS_TO_ADD = Time.now.year - 2009
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

puts %Q{
    CREATE TABLE Meetings (
        [MeetingID] INTEGER PRIMARY KEY AUTOINCREMENT,
        [Start] DATETIME NOT NULL,
        [End] DATETIME NOT NULL,
        [StartTimezone] TEXT,
        [EndTimezone] TEXT,
        [Title] TEXT,
        [Description] TEXT,
        [RecurrenceRule] TEXT,
        [RecurrenceException] TEXT,
        [RecurrenceID] INT,
        [IsAllDay] INT NOT NULL,
        [RoomID] INT
    );

    DROP TABLE MeetingAttendees;

    CREATE TABLE MeetingAttendees (
        [MeetingID] INTEGER,
        [AttendeeID] INTEGER
    );

    CREATE TABLE Tasks (
        [TaskID] INTEGER PRIMARY KEY AUTOINCREMENT,
        [Start] DATETIME NOT NULL,
        [End] DATETIME NOT NULL,
        [StartTimezone] TEXT,
        [EndTimezone] TEXT,
        [Title] TEXT,
        [Description] TEXT,
        [RecurrenceRule] TEXT,
        [RecurrenceException] TEXT,
        [RecurrenceID] INT,
        [IsAllDay] INT NOT NULL,
        [OwnerID] INT
    );


    BEGIN TRANSACTION;
}

def parse_date(d)
    DateTime.iso8601(d.sub(" ", "T"))
end

CSV.foreach('meetings.csv', :headers => true) do |row|
    start_date = parse_date(row['Start'])
    end_date = parse_date(row['End'])

    puts %Q{
    INSERT INTO Meetings
        ([MeetingID], [Start], [End], [StartTimezone], [EndTimezone], [Title], [Description], [RecurrenceException], [RecurrenceRule], [RecurrenceID], [IsAllDay], [RoomID])
    VALUES
        (#{row['MeetingID']}, '#{start_date.strftime(DATE_FORMAT)}', '#{end_date.strftime(DATE_FORMAT)}', "#{row['StartTimezone']}", "#{row['EndTimezone']}", "#{row['Title']}", "#{row['Description']}", "#{row['RecurrenceException']}",  "#{row['RecurrenceRule']}", "#{row['RecurrenceID']}", #{row['IsAllDay'] == 'True' ? 1 : 0}, #{row['RoomID']});
    }
end

CSV.foreach('tasks.csv', :headers => true) do |row|
    start_date = parse_date(row['Start'])
    end_date = parse_date(row['End'])

    puts %Q{
    INSERT INTO Tasks
        ([TaskID], [Start], [End], [StartTimezone], [EndTimezone], [Title], [Description], [RecurrenceException], [RecurrenceRule], [RecurrenceID], [IsAllDay], [OwnerID])
    VALUES
        (#{row['TaskID']}, '#{start_date.strftime(DATE_FORMAT)}', '#{end_date.strftime(DATE_FORMAT)}', "#{row['StartTimezone']}", "#{row['EndTimezone']}", "#{row['Title']}", "#{row['Description']}", "#{row['RecurrenceException']}",  "#{row['RecurrenceRule']}", "#{row['RecurrenceID']}", #{row['IsAllDay'] == 'True' ? 1 : 0}, #{row['OwnerID']});
    }
end

CSV.foreach('meeting-attendees.csv', :headers => true) do |row|
    puts %Q{
    INSERT INTO MeetingAttendees
        ([MeetingID], [AttendeeID])
    VALUES
        (#{row['MeetingID']}, #{row['AttendeeID']});
    }
end

puts %Q{
    COMMIT TRANSACTION;
}
