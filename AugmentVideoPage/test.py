from __future__ import print_function
import httplib2
import os

from apiclient import discovery

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
        
        

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        main(key=argv[1])
    else:
        main()
        print(likely)