from youtube_transcript_api import YouTubeTranscriptApi
import collections
import sys
import httplib2
import os

from apiclient import discovery


def CountFrequency(my_list):     
   # Creating an empty dictionary
    dict = collections.Counter(my_list)
    sort_dict = sorted(dict.items(), key=lambda x: x[1], reverse=True)
    return sort_dict

#Store the list of possible words

possible = set()
likely   = set()

discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?'
                'version=v4')
service = discovery.build(
    'sheets',
    'v4',
    http=httplib2.Http(),
    discoveryServiceUrl=discoveryUrl,
    developerKey='AIzaSyBSKi8lpsiRnEMCr4wtS7QuM6BX7nPtshg')

spreadsheetId = '1ozg1Cnm6SdtM4M5rATkANAi07xAzYWaKL7HKxyvoHzk'
rangeName = 'Demonetized Words!A4:A2991'

try:

    result = service.spreadsheets().values().get(
    spreadsheetId=spreadsheetId, range=rangeName).execute()
    words = result.get('values', [])

    include_grid_data = True
    request = service.spreadsheets().get(spreadsheetId=spreadsheetId, ranges=rangeName, includeGridData=include_grid_data)
    response = request.execute()
    colors = response['sheets'][0]['data'][0]['rowData']

    red_base = 1 
    green_base = 0.9490196 
    blue_base = 0.8

    all_colors = []
    for val, word in zip(colors, words):
        red = val['values'][0]['userEnteredFormat']['backgroundColor']['red']
        green = val['values'][0]['userEnteredFormat']['backgroundColor']['green']
        blue = val['values'][0]['userEnteredFormat']['backgroundColor']['blue']
        if red == red_base and green == green_base and blue == blue_base:
            possible.add(word[0].lower())
        else:
            likely.add(word[0].lower())
    
except:
    print("Not available")
    sys.exit()

# Get the video id here - Try/Except to check whether the video has any transcript
video_id = sys.argv[1]

try:
    transcripts = YouTubeTranscriptApi.get_transcript(video_id)
    transcriptsVideo = []
    for obj in transcripts:
        text = obj['text'].lower()
        # text = text+ obj['text'].lower()
        transcriptsVideo.extend(text.split(" "))

    #get the frequency of items in the list

    
    transcriptsVideo_Set = set(transcriptsVideo)

    wordsFound = list(likely & transcriptsVideo_Set)

    print(wordsFound)

    # Case 1
    # No key words, then return "No demonetized keywords"
    if len(wordsFound) == 0:
        
        #Check again in the possible set
        wordsPossible = list(possible & transcriptsVideo_Set)
        
        # Subcase 1
        if len(wordsPossible) == 0:   
            output ="Not available"

        #subcase 2
        elif len(wordsPossible)<=10:
            output=",".join(wordsPossible)
        
        #subcase 3
        else:
            temp = []
            counter = collections.Counter(wordsPossible)
            for key, value in counter.most_common(10):
                temp.append(key)
            output= ",".join(temp)

    # Case 2
    # If there are more than 10 words, then pick top 10
    elif len(wordsFound) <=10:
        print("came")
        output= ",".join(wordsFound)

    # Case 3
    # 1 to 10 demonetized keywords
    else:
        temp = []

        countTranscripts = CountFrequency(transcriptsVideo)
        counter = 0

        print(countTranscripts)

        for key,val in countTranscripts:
            if val in wordsFound:
                temp.append(val)
                counter +=1
            
            if counter==10:
                break
        output= ",".join(temp)
except:
    output = "Not available"

print(output)