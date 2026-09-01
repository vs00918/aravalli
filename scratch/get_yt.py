import urllib.request
import re
import json

url = "https://www.youtube.com/watch?v=jLMN1gJTt94"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        m = re.search(r'<title>(.*?)</title>', html)
        if m:
            print("TITLE:", m.group(1))
        m2 = re.search(r'"videoDetails":\s*({.*?}),"isLiveContent"', html)
        if m2:
            print("DETAILS:", m2.group(1)[:500])
        else:
            m3 = re.search(r'"title":\s*{"runs":\s*\[{"text":\s*"(.*?)"}\]', html)
            if m3:
                print("RUNS TITLE:", m3.group(1))
            m4 = re.search(r'"description":\s*{"simpleText":\s*"(.*?)"}', html)
            if m4:
                print("SIMPLE DESC:", m4.group(1)[:500])
except Exception as e:
    print("Error:", e)
