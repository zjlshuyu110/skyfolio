"""Public regression checks: no personal workbook is needed."""
import json
import re
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
WEB=ROOT/'outputs/flight-journal/web'
DEMO=ROOT/'docs/demo'

class DemoTests(unittest.TestCase):
    def test_fictional_data_has_no_personal_sources(self):
        data=json.loads((DEMO/'data/demo.json').read_text(encoding='utf-8'))
        self.assertEqual(len(data['flights']),20)
        self.assertEqual(len(data['canceled']),2)
        for f in data['flights']+data['canceled']:
            self.assertEqual(f['booking'],'FICTIONAL')
            self.assertEqual(f['airline'],'Demo Airways')
            self.assertEqual(f['mailbox'],'')
            self.assertEqual(f['links'],[])
            self.assertGreater(f['duration'],0)
            self.assertIn(f['origin'],data['airports'])
            self.assertIn(f['destination'],data['airports'])
        self.assertTrue(all(f['flown'] and not f['excluded'] for f in data['flights']))
        self.assertTrue(all(f['excluded'] and not f['flown'] for f in data['canceled']))

    def test_build_is_current_and_self_contained(self):
        expected={'index.html','app.js','i18n.js','styles.css','icon.svg','GUIDE.html','data/demo.json','data/world.json','data/airports-LICENSE.txt'}
        actual={p.relative_to(DEMO).as_posix() for p in DEMO.rglob('*') if p.is_file()}
        self.assertEqual(actual,expected)
        for name in expected-{'index.html'}:
            self.assertEqual((DEMO/name).read_bytes(),(WEB/name).read_bytes(),name)
        html=(DEMO/'index.html').read_text(encoding='utf-8')
        self.assertIn('data-mode="demo"',html)
        for url in re.findall(r'(?:src|href)="(\./[^"#?]+)',html):
            self.assertTrue((DEMO/url[2:]).is_file(),url)
        self.assertNotRegex(html,r'(?:src|href)="/(?!/)')
        self.assertIn("if(DEMO)return;",(DEMO/'app.js').read_text(encoding='utf-8'))

    def test_readme_preview_and_navigation_links_exist(self):
        for name in ['README.md','README.zh-CN.md']:
            text=(ROOT/name).read_text(encoding='utf-8')
            for link in re.findall(r'\]\(([^)]+)\)',text):
                if not link.startswith(('http:','https:','#')):
                    self.assertTrue((ROOT/link).exists(),f'{name}: {link}')

if __name__=='__main__':
    unittest.main()
