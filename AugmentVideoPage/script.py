# -*- coding: utf-8 -*-
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
    data = ['able', 'about', 'above', 'abroad', 'according', 'accordingly', 'across', 'actually', 'adj', 'after', 'afterwards', 'again', 'against', 'ago', 'ahead', "ain't", 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'alongside', 'already', 'also', 'although', 'always', 'am', 'amid', 'amidst', 'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are', "aren't", 'around', 'as', "a's", 'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'back', 'backward', 'backwards', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'begin', 'behind', 'being', 'believe', 'below', 'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but', 'by', 'came', 'can', 'cannot', 'cant', "can't", 'caption', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly', "c'mon", 'co', 'co.', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'contain', 'containing', 'contains', 'corresponding', 'could', "couldn't", 'course', "c's", 'currently', 'dare', "daren't", 'definitely', 'described', 'despite', 'did', "didn't", 'different', 'directly', 'do', 'does', "doesn't", 'doing', 'done', "don't", 'down', 'downwards', 'during', 'each', 'edu', 'eg', 'eight', 'eighty', 'either', 'else', 'elsewhere', 'end', 'ending', 'enough', 'entirely', 'especially', 'et', 'etc', 'even', 'ever', 'evermore', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex', 'exactly', 'example', 'except', 'fairly', 'far', 'farther', 'few', 'fewer', 'fifth', 'first', 'five', 'followed', 'following', 'follows', 'for', 'forever', 'former', 'formerly', 'forth', 'forward', 'found', 'four', 'from', 'further', 'furthermore', 'get', 'gets', 'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'had', "hadn't", 'half', 'happens', 'hardly', 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", 'hello', 'help', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', "here's", 'hereupon', 'hers', 'herself', "he's", 'hi', 'him', 'himself', 'his', 'hither', 'hopefully', 'how', 'howbeit', 'however', 'hundred', "i'd", 'ie', 'if', 'ignored', "i'll", "i'm", 'immediate', 'in', 'inasmuch', 'inc', 'inc.', 'indeed', 'indicate', 'indicated', 'indicates', 'inner', 'inside', 'insofar', 'instead', 'into', 'inward', 'is', "isn't", 'it', "it'd", "it'll", 'its', "it's", 'itself', "i've", 'just', 'k', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last', 'lately', 'later', 'latter', 'latterly', 'least', 'less', 'lest', 'let', "let's", 'like', 'liked', 'likely', 'likewise', 'little', 'look', 'looking', 'looks', 'low', 'lower', 'ltd', 'made', 'mainly', 'make', 'makes', 'many', 'may', 'maybe', "mayn't", 'me', 'mean', 'meantime', 'meanwhile', 'merely', 'might', "mightn't", 'mine', 'minus', 'miss', 'more', 'moreover', 'most', 'mostly', 'mr', 'mrs', 'much', 'must', "mustn't", 'my', 'myself', 'name', 'namely', 'nd', 'near', 'nearly', 'necessary', 'need', "needn't", 'needs', 'neither', 'never', 'neverf', 'neverless', 'nevertheless', 'new', 'next', 'nine', 'ninety', 'no', 'nobody', 'non', 'none', 'nonetheless', 'noone', 'no-one', 'nor', 'normally', 'not', 'nothing', 'notwithstanding', 'novel', 'now', 'nowhere', 'obviously', 'of', 'off', 'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', "one's", 'only', 'onto', 'opposite', 'or', 'other', 'others', 'otherwise', 'ought', "oughtn't", 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'particular', 'particularly', 'past', 'per', 'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably', 'probably', 'provided', 'provides', 'que', 'quite', 'qv', 'rather', 'rd', 're', 'really', 'reasonably', 'recent', 'recently', 'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right', 'round', 'said', 'same', 'saw', 'say', 'saying', 'says', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'self', 'selves', 'sensible', 'sent', 'serious', 'seriously', 'seven', 'several', 'shall', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'since', 'six', 'so', 'some', 'somebody', 'someday', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub', 'such', 'sup', 'sure', 'take', 'taken', 'taking', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx', 'that', "that'll", 'thats', "that's", "that've", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', "there'd", 'therefore', 'therein', "there'll", "there're", 'theres', "there's", 'thereupon', "there've", 'these', 'they', "they'd", "they'll", "they're", "they've", 'thing', 'things', 'think', 'third', 'thirty', 'this', 'thorough', 'thoroughly', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'till', 'to', 'together', 'too', 'took', 'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', "t's", 'twice', 'two', 'un', 'under', 'underneath', 'undoing', 'unfortunately', 'unless', 'unlike', 'unlikely', 'until', 'unto', 'up', 'upon', 'upwards', 'us', 'use', 'used', 'useful', 'uses', 'using', 'usually', 'v', 'value', 'various', 'versus', 'very', 'via', 'viz', 'vs', 'want', 'wants', 'was', "wasn't", 'way', 'we', "we'd", 'welcome', 'well', "we'll", 'went', 'were', "we're", "weren't", "we've", 'what', 'whatever', "what'll", "what's", "what've", 'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', "where's", 'whereupon', 'wherever', 'whether', 'which', 'whichever', 'while', 'whilst', 'whither', 'who', "who'd", 'whoever', 'whole', "who'll", 'whom', 'whomever', "who's", 'whose', 'why', 'will', 'willing', 'wish', 'with', 'within', 'without', 'wonder', "won't", 'would', "wouldn't", 'yes', 'yet', 'you', "you'd", "you'll", 'your', "you're", 'yours', 'yourself', 'yourselves', "you've", 'zero', 'a', "how's", 'i', "when's", "why's", 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'uucp', 'w', 'x', 'y', 'z', 'I', 'www', 'amount', 'bill', 'bottom', 'call', 'computer', 'con', 'couldnt', 'cry', 'de', 'describe', 'detail', 'due', 'eleven', 'empty', 'fifteen', 'fifty', 'fill', 'find', 'fire', 'forty', 'front', 'full', 'give', 'hasnt', 'herse', 'himse', 'interest', 'itse”', 'mill', 'move', 'myse”', 'part', 'put', 'show', 'side', 'sincere', 'sixty', 'system', 'ten', 'thick', 'thin', 'top', 'twelve', 'twenty', 'abst', 'accordance', 'act', 'added', 'adopted', 'affected', 'affecting', 'affects', 'ah', 'announce', 'anymore', 'apparently', 'approximately', 'aren', 'arent', 'arise', 'auth', 'beginning', 'beginnings', 'begins', 'biol', 'briefly', 'ca', 'date', 'ed', 'effect', 'et-al', 'ff', 'fix', 'gave', 'giving', 'heres', 'hes', 'hid', 'home', 'id', 'im', 'immediately', 'importance', 'important', 'index', 'information', 'invention', 'itd', 'keys', 'kg', 'km', 'largely', 'lets', 'line', "'ll", 'means', 'mg', 'million', 'ml', 'mug', 'na', 'nay', 'necessarily', 'nos', 'noted', 'obtain', 'obtained', 'omitted', 'ord', 'owing', 'page', 'pages', 'poorly', 'possibly', 'potentially', 'pp', 'predominantly', 'present', 'previously', 'primarily', 'promptly', 'proud', 'quickly', 'ran', 'readily', 'ref', 'refs', 'related', 'research', 'resulted', 'resulting', 'results', 'run', 'sec', 'section', 'shed', 'shes', 'showed', 'shown', 'showns', 'shows', 'significant', 'significantly', 'similar', 'similarly', 'slightly', 'somethan', 'specifically', 'state', 'states', 'stop', 'strongly', 'substantially', 'successfully', 'sufficiently', 'suggest', 'thered', 'thereof', 'therere', 'thereto', 'theyd', 'theyre', 'thou', 'thoughh', 'thousand', 'throug', 'til', 'tip', 'ts', 'ups', 'usefully', 'usefulness', "'ve", 'vol', 'vols', 'wed', 'whats', 'wheres', 'whim', 'whod', 'whos', 'widely', 'words', 'world', 'youd', 'youre']
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
        print("Keywords Sheet Not Available"+ "__")
        sys.exit()

    # Get the video id here - Try/Except to check whether the video has any transcript
    video_id = id

    stopWords = readStopWords()
    
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
        output = "Transcripts Not Available"

    print(output + "__" + ",".join(demonetized_res[0]))

#call the main function
main(sys.argv[1])