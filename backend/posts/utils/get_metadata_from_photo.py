import piexif
from PIL import Image


def get_exif_data(image_path):
    try:
        # Открываем изображение
        with Image.open(image_path) as image:
            exif_data = piexif.load(image.info['exif'])
            return exif_data
    except Exception as e:
        print(f"Ошибка при получении EXIF данных: {e}")
        return None


def convert_to_degress(value):
    """
    Преобразует координаты из формата (degrees, minutes, seconds) в десятичные градусы.
    """
    degrees = value[0][0] / value[0][1]  # degrees
    minutes = value[1][0] / value[1][1] / 60.0  # minutes to decimal
    seconds = value[2][0] / value[2][1] / 3600.0  # seconds to decimal
    return degrees + minutes + seconds


def get_gps_info(image_path):
    exif_data = get_exif_data(image_path)
    if exif_data and 'GPS' in exif_data:
        gps_info = exif_data['GPS']

        latitude = gps_info.get(2)  # (degrees, minutes, seconds)
        latitude_ref = gps_info.get(1)  # N or S
        longitude = gps_info.get(4)  # (degrees, minutes, seconds)
        longitude_ref = gps_info.get(3)  # E or W

        if latitude and longitude:
            lat = convert_to_degress(latitude)
            lon = convert_to_degress(longitude)

            # Определение знака координат
            if latitude_ref == b'S':
                lat = -lat
            if longitude_ref == b'W':
                lon = -lon

            return lat, lon

    return None, None
