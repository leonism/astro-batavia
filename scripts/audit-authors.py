import os
import re

authors_dir = 'src/content/authors'
files = [f for f in os.listdir(authors_dir) if f.endswith('.md')]

for file in files:
    file_path = os.path.join(authors_dir, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple frontmatter split
    parts = content.split('---', 2)
    if len(parts) < 3:
        continue
    
    fm = parts[1]
    slug = file.replace('.md', '')
    
    social_links = {
        'twitter': f'https://x.com/{slug}',
        'github': f'https://github.com/{slug}',
        'linkedin': f'https://linkedin.com/in/{slug}',
        'website': f'https://{slug}.com'
    }
    
    updated_fm = fm
    
    if 'social:' not in fm:
        social_block = "\nsocial:\n"
        for key, val in social_links.items():
            social_block += f"  {key}: \"{val}\"\n"
        updated_fm = fm.rstrip() + social_block
    else:
        # Check individual links
        for key, val in social_links.items():
            if f'{key}:' not in fm:
                # Find the social: line and append after it
                updated_fm = re.sub(r'(social:.*)', rf'\1\n  {key}: "{val}"', updated_fm)
    
    if updated_fm != fm:
        new_content = f'---{updated_fm}---{parts[2]}'
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
