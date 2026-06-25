import json

with open('../dados/leads_sem_site.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

leads = data['leads']

# Check how many have website
with_site = [l for l in leads if l.get('website') and l['website'] != '']
without_site = [l for l in leads if not l.get('website') or l['website'] == '']

print(f"COM site (remover): {len(with_site)}")
for l in with_site:
    print(f"  - {l['nome'][:50]} | site: {l.get('website', '')}")

print(f"\nSEM site (manter): {len(without_site)}")

# Show first lead to understand structure
print("\nSample lead:")
print(json.dumps(without_site[0], indent=2, ensure_ascii=False))
