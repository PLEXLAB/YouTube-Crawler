from youtube_transcript_api import YouTubeTranscriptApi
import collections
import sys
import httplib2
import os
import inflect # To find the plural word

from apiclient import discovery

def CountFrequency(my_list):     
   # Creating an empty dictionary
    dict = collections.Counter(my_list)
    sort_dict = sorted(dict.items(), key=lambda x: x[1], reverse=True)
    return sort_dict


def readStopWords():
    # Read from the file
    data = []
    try:
        with open("stop_words_english.txt", 'r') as file:
            for line in file:
                data.append(line.rstrip('\n'))

    except:
        print("Error reading file")

    return data

def getPossibleWords(possible, transcriptsVideo_Set, transcriptsVideo, k):

    wordsPossible = list(possible & transcriptsVideo_Set)
    length = len(wordsPossible)

    wordsPossibleSet = set(wordsPossible)

    # Sort the list of possible words
    wordsPossible.sort()

    #filter the plural words in the wordsPossible list
    p = inflect.engine()

    for word in wordsPossible:
        if p.plural(word) in wordsPossibleSet:
            wordsPossible.remove(p.plural(word))

    # Base Case (length == 0)    
    if length == 0:
        return []

    #Case 1 - PossibleWords < required(k)
    if length <=k:
        return wordsPossible
    
    #Case 2 - PossibleWords > required(k)  # possible = 7, required = 3, possible = 10, required = 10
    else:
        temp = []
        countTranscripts = CountFrequency(transcriptsVideo)
        counter = 0

        #Get the top 10 from the transcripts
        for key, val in countTranscripts:
            if key in possible:
                temp.append(key)
                counter +=1
            
            if counter==k:
                break
        output = temp

    return output

#Store the list of possible words

def main(id):

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
    video_id = id

    stopWords = readStopWords()
    # Edge Case - Check whether it has stopwords and reads it successfully
    if len(stopWords) == 0:
        return "Error reading StopWords File"
    
    #create a stopwords set
    stopWordsSet = set(stopWords)

    # create demonetized words output
    demonetized_output = set()
    demonetized_res = [[""]]

    try:
        transcripts = YouTubeTranscriptApi.get_transcript(video_id)
        transcriptsVideo = []
        for obj in transcripts:
            text = obj['text'].lower()
            # text = text+ obj['text'].lower()
            newWordList = text.split(" ")

            #filter the stop words
            for word in newWordList:
                if word not in stopWordsSet:
                    transcriptsVideo.append(word)

        transcriptsVideo_Set = set(transcriptsVideo)
        wordsLikely = list(likely & transcriptsVideo_Set)
        demonetized_output.update(likely & transcriptsVideo_Set)
        demonetized_output.update(possible & transcriptsVideo_Set)
        demonetized_res[0] = list(demonetized_output)


        wordsLikelySet = set(wordsLikely)
        wordsLikely.sort()

        #filter the plural words in the wordsLikely list
        p = inflect.engine()

        for word in wordsLikely:
            if p.plural(word) in wordsLikelySet:
                wordsLikely.remove(p.plural(word))


        # Case 1 - less than 10 words
        # No key words, then return "No demonetized keywords"
        if len(wordsLikely) < 10:
            
            k = 10 - len(wordsLikely)

            #Check again in the possible set of words
            wordsPossible = getPossibleWords(possible, transcriptsVideo_Set, transcriptsVideo, k)
            totalWords = wordsLikely + wordsPossible
            output = ",".join(sorted(totalWords))

        # Case 2- rare case
        # exactly 10 demonetized keywords
        elif len(wordsLikely) == 10:
            output = ",".join(sorted(wordsLikely))

        #Case 3 - more than 10 words in likeley list
        # Pick top 10 words from the transcript video
        else:
            temp = []
            countTranscripts = CountFrequency(transcriptsVideo)
            counter = 0

            #Get the top 10 from the transcripts
            for key, val in countTranscripts:
                if key in likely:
                    temp.append(key)
                    counter +=1
                
                if counter==10:
                    break
            output= ",".join(sorted(temp))
    except:
        output = ""

    print(output + "__" + ",".join(demonetized_res[0]))

#call the main function
main(sys.argv[1])