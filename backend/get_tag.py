import ollama
from deep_translator import GoogleTranslator

def get_tag(filepath):
    with open(filepath, 'rb') as file:
        image_data = file.read()
    res = ollama.chat(
        model="llava",
        messages=[
            {
                'role': 'user',
                'content': """Analyze the picture and choose the most appropriate hashtag 
                from the list: food, cinema, sports, museums, monuments, 
                galleries, nature. Print only one word - the hashtag.""",
                'images': [image_data]
            }
        ]
    )
    translator = GoogleTranslator(source='auto', target='ru')
    perevod = translator.translate(res['message']['content'])
    return perevod

def get_description(filepath):
    with open(filepath, 'rb') as file:
        image_data = file.read()
    res = ollama.chat(
        model="llava",
        messages=[
            {
                'role': 'user',
                'content': """This photo would be on the site with attractions and 
                    showplaces. Generate attractive description 
                    of the place on a photo for the site.
                    The description should attract tourists to visit this place.
                    Start right away with the description.
                    Write up to 70 words.""",
                'images': [image_data]
            }
        ]
    )
    translator = GoogleTranslator(source='auto', target='ru')
    perevod = translator.translate(res['message']['content'])
    return perevod
