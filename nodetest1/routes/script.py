import os
import sys
import matplotlib.pyplot as plt
import random 
from pandas import DataFrame
import seaborn as sns
import pandas as pd

#Storing the data (Passed as arguments from node js) - Starts here

video = sys.argv[2]
video = list(map(float, video.strip('[]').split(',')))

video_id = sys.argv[3]
video_id = list(map(str,video_id.strip('[]').split(',')))

days = sys.argv[4]
days = list(map(str,days.strip('[]').split(',')))

positiveReviews = sys.argv[5]
positiveReviews = list(map(float,positiveReviews.strip('[]').split(',')))

negativeReviews = sys.argv[6]
negativeReviews = list(map(float,negativeReviews.strip('[]').split(',')))

neutralReviews = sys.argv[7]
neutralReviews = list(map(float,neutralReviews.strip('[]').split(',')))

mediaTopics = sys.argv[8]
mediaTopics = list(map(float,mediaTopics.strip('[]').split(',')))

politicalTopics = sys.argv[9]
politicalTopics = list(map(float,politicalTopics.strip('[]').split(',')))

controversialTopics = sys.argv[10]
controversialTopics = list(map(float,controversialTopics.strip('[]').split(',')))
#Storing the data (Passed as arguments from node js) - Ends here

#Data Preprocessing - Pie chart - Image 1 - Starts here
piechart_Data = video

# hardcoded labels - Need to replace (The labels must be equal to the length of the pieChart Data list)
piechart_labels = video_id

#Colors of the piechart
my_colors = ['lightblue','lightsteelblue','silver','lightyellow', 'aquamarine']
#Data Preprocessing - Pie chart - Image 1 - Ends here


#Data Preprocessing - Bar chart - Image 2 - Starts here
barchart_Data_y = video #Using the piechart data
barchart_Data_x = video_id
# Data Preprocessing - Bar chart - Image 2 - Ends here



#Leaf directory
directory = sys.argv[1]
  
# Path
path = "../public/images/"+directory

print("reached here") 

if not os.path.exists(path):
    os.makedirs(path)


#Generating pie chart - Image 1 Starts here
strFile = "../public/images/"+sys.argv[1]+"/piechart.png"
if os.path.isfile(strFile):
    os.remove(strFile)   # Opt.: os.system("rm "+strFile)

plt.pie(piechart_Data,labels=piechart_labels,autopct='%1.1f%%', colors = my_colors)
plt.axis('equal')
plt.savefig(strFile)
plt.clf()
#Generating pie chart - Image 1 ends here


#Generating Bar chart - Image 2 starts here
strFile = "../public/images/"+sys.argv[1]+"/barchart.png" 
if os.path.isfile(strFile):
    os.remove(strFile)   # Opt.: os.system("rm "+strFile)

#Construct a dataframe
data_barchart = pd.DataFrame({'Video Id': video_id, 'Total Views': video})

sns.set_style('darkgrid')
sns.barplot(x='Video Id', y="Total Views", color='lightblue', data=data_barchart)
plt.savefig(strFile)
plt.clf()
#Generating Bar chart - Image 2 ends here


#Generating Horizontal Bar chart - Image 3 starts here

strFile = "../public/images/"+sys.argv[1]+"/barchart-horizontal.png" 
if os.path.isfile(strFile):
    os.remove(strFile)  

data_barchart = pd.DataFrame({'Video Id': video_id, 'Total Views': video})

sns.set_style('darkgrid')
sns.barplot( x="Total Views", y='Video Id', color='lightblue', data=data_barchart)
plt.savefig(strFile)
plt.clf()
#Generating Horizontal Bar chart - Image 3 ends here

#Generating Donut plots - Image 4 starts here

strFile = "../public/images/"+sys.argv[1]+"/donutplot.png" 
if os.path.isfile(strFile):
    os.remove(strFile)  

donut_colors = ['#ff9999','#66b3ff','#99ff99','#ffcc99', 'lightblue']
explode = (0.05,0.05,0.05,0.05, 0.05)
 

# Create a pieplot
plt.pie(video, labels = video_id, colors = donut_colors, autopct='%1.1f%%', startangle=90, pctdistance=0.85, explode = explode)

# add a circle at the center to transform it in a donut chart
my_circle=plt.Circle( (0,0), 0.7, color='white')
p=plt.gcf()
p.gca().add_artist(my_circle)

p.savefig(strFile)
p.clf()
#Generating Donut plots - Image 4 ends here


#Generating Scatter Plots - Image 5 starts here
strFile = "../public/images/"+sys.argv[1]+"/scatterplot1.png" 
if os.path.isfile(strFile):
    os.remove(strFile)  

plt.plot(days, positiveReviews, 'co-', days, negativeReviews,'bo-', days, neutralReviews, 'ro-')
plt.legend(['Positive','Negative', 'Neutral'])
plt.savefig(strFile)
plt.clf()

#Generating Scatter Plots - Image 5 ends here


#Generating Scatter Plots - Image 6 starts here
strFile = "../public/images/"+sys.argv[1]+"/scatterplot2.png" 
if os.path.isfile(strFile):
    os.remove(strFile)  

plt.plot(days, mediaTopics, 'co-', days, politicalTopics,'bo-', days, controversialTopics, 'ro-')
plt.legend(['Media','Political', 'Controversial'])
plt.savefig(strFile)
plt.clf()

#Generating Scatter Plots - Image 6 ends here


print("\nOutput from Python")
