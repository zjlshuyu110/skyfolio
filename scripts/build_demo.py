"""Build an allowlisted static demo. Never read a workbook or work/ archive."""
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
WEB=ROOT/'outputs/flight-journal/web'
OUT=ROOT/'docs/demo'
PUBLIC=['index.html','app.js','i18n.js','styles.css','icon.svg','GUIDE.html','guide.js','data/world.json','data/demo.json','data/airports-LICENSE.txt']
for relative in PUBLIC:
    target=OUT/relative
    target.parent.mkdir(parents=True,exist_ok=True)
    if relative=='index.html':
        html=(WEB/relative).read_text(encoding='utf-8').replace('<html lang="zh-CN">','<html lang="zh-CN" data-mode="demo">')
        target.write_text(html,encoding='utf-8')
    else:
        shutil.copyfile(WEB/relative,target)
print(f'Static demo ready: {OUT}')
