import sys
import scrapetube

videos = scrapetube.get_channel(channel_url='https://www.youtube.com/channel/UCN6FkISH_1Mz6Q3Wqbru5pg', limit=1, sort_by='newest')
id = next(iter(videos))['videoId']
print(id)
sys.stdout.flush()
