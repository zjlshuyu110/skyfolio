"""Generate fictional journeys from public airport coordinates, never private workbooks."""
import json, math
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'outputs/flight-journal/web/data'
airports=json.loads((DATA/'airports.json').read_text(encoding='utf-8'))
routes=[('SFO','JFK',330),('JFK','LHR',420),('LHR','AMS',80),('AMS','ARN',125),('ARN','AMS',130),('AMS','CDG',85),('CDG','LIS',165),('LIS','LHR',170),('LHR','JFK',470),('JFK','SFO',370),('SFO','HND',660),('HND','ICN',155),('ICN','SIN',385),('SIN','SYD',480),('SYD','SIN',495),('SIN','HND',420),('HND','SFO',560),('SFO','SEA',130),('SEA','SFO',135),('SFO','JFK',335)]
def flight(index, origin, destination, duration, canceled=False):
    a,b=airports[origin],airports[destination]
    start=(datetime(2025,1,10,10,15)+timedelta(days=index*16)).replace(tzinfo=ZoneInfo(a['tz']))
    end=(start.astimezone(timezone.utc)+timedelta(minutes=duration)).astimezone(ZoneInfo(b['tz']))
    la,lb=map(math.radians,(a['lat'],b['lat']));dl=math.radians(b['lon']-a['lon'])
    h=math.sin((lb-la)/2)**2+math.cos(la)*math.cos(lb)*math.sin(dl/2)**2
    return dict(id=f'demo-{index}',date=start.date().isoformat(),number=f'DJ{100+index}',origin=origin,destination=destination,originCity=a['city'],destinationCity=b['city'],originLabel=f"{origin} {a['city']}",destinationLabel=f"{destination} {b['city']}",departure=start.strftime('%H:%M'),arrivalDate=end.date().isoformat(),arrival=end.strftime('%H:%M'),airline='Demo Airways',booking='FICTIONAL',evidence='Synthetic demonstration record',status='不导入' if canceled else '已乘坐',notes='Fictional flight, number and schedule. Not a real booking or a verified airline service.',mailbox='',mailDate=None,source='',extraSources='',links=[],sheet='取消及旧票' if canceled else '航班记录',row=index+5,distance=round(6371.0088*2*math.asin(math.sqrt(min(1,h)))),duration=duration,inferred=index==3,flown=not canceled,excluded=canceled)
flights=[flight(i,*r) for i,r in enumerate(routes)]
canceled=[flight(21,'LHR','CDG',85,True),flight(22,'SFO','LAX',90,True)]
codes={row[k] for row in flights+canceled for k in ('origin','destination')}
data=dict(flights=flights,canceled=canceled,clues=[],airports={c:airports[c] for c in sorted(codes)},warnings=[],revision='fictional-demo-v1',source=dict(name='Fictional journeys',path='Bundled demo data',modifiedAt='2025-12-31T12:00:00Z'),sync=dict(state='ok',message='Demo data',pollSeconds=0))
(DATA/'demo.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Generated 20 fictional flights and 2 canceled examples.')
