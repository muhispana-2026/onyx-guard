import requests

url = "http://127.0.0.1:3000/api/projects"
try:
    res = requests.get(url)
    print(res.json())
except Exception as e:
    print(e)
