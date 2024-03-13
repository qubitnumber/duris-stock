from zoneinfo import ZoneInfo
import datetime

def unix_timestamp_from_date(date, format='%Y-%m-%d'):
    '''Transform human readable date string to UNIX timestamp'''
    return int(
        datetime.datetime.strptime(date, format)
        .replace(tzinfo=ZoneInfo('US/Eastern'))
        .timestamp()
    )